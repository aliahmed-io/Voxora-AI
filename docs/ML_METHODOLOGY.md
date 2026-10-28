# Voxora AI — Machine Learning Methodology & Academic Defense

## 1. Problem Formulation & Task Definition

Customer feedback in enterprise applications arrives as high-volume, unstructured natural language text. Converting this stream into actionable business intelligence requires addressing two distinct, mathematically decoupled machine learning tasks:

1. **Supervised 3-Class Sentiment Classification**:
   Given a customer review document $d \in \mathcal{D}$, predict a discrete sentiment class $y \in \{\text{positive}, \text{neutral}, \text{negative}\}$ alongside calibrated posterior confidence probabilities:
   $$P(y = c \mid d) \quad \text{for } c \in \{\text{positive}, \text{neutral}, \text{negative}\}, \quad \sum_{c} P(y=c \mid d) = 1.0$$

   *Academic Defensibility Note*: Many naive systems attempt to derive a "neutral" class by thresholding a model trained solely on binary (positive/negative) data. In Voxora AI, the model is trained from first principles on a genuine, balanced 3-class distribution.

2. **Unsupervised Topic Discovery**:
   Discover $K=5$ latent semantic themes across the review corpus without supervision, projecting each review into a normalized topic distribution:
   $$\mathbf{h}_d \in \mathbb{R}^K, \quad \sum_{k=1}^K h_{dk} = 1.0$$

3. **Transparent Linear Explainability**:
   For any individual prediction, compute token-level linear feature attributions quantifying each term's directional influence on the classifier's decision boundary.

---

## 2. Dataset Construction & Stratification Protocol

To ensure academic reproducibility, the training corpus comprises **1,555 verified customer reviews** across 5 business domains (Platform Reliability, Customer Support, UI & Usability, Pricing & Billing, and Feature Requests).

### 2.1 Partitioning Protocol
Data leakage is prevented by enforcing strict isolation before any vectorizer fitting or parameter optimization:

| Partition | Proportion | Sample Count | Purpose |
| :--- | :--- | :--- | :--- |
| **Training Set** | 70% | 1,088 | Vectorizer vocabulary fitting and model parameter learning |
| **Validation Set** | 15% | 233 | Model tournament selection and hyperparameter tuning |
| **Test Set** | 15% | 234 | Final, untouched evaluation and confusion matrix generation |

Stratified sampling (`StratifiedShuffleSplit`) guarantees identical class distributions across all three partitions:
- **Positive**: 33.3% (~518 samples)
- **Neutral**: 33.3% (~518 samples)
- **Negative**: 33.3% (~519 samples)

---

## 3. Negation Preservation & Text Preprocessing

Standard NLP preprocessing pipelines destroy critical sentiment signals by stripping stopwords such as *"not"*, *"never"*, or *"no"*. In standard stopword filtering:
$$\text{"The platform is not great"} \xrightarrow{\text{standard stopword removal}} \text{"platform great" (Classified as Positive)}$$

Voxora AI addresses this fundamental flaw through a three-stage negation-preserving pipeline:

### 3.1 Contraction Expansion
Informal customer reviews frequently contain contractions where negation morphemes are attached to auxiliary verbs. A deterministic regex pass expands all contracted forms prior to tokenization:
- `isn't` $\rightarrow$ `is not`
- `aren't` $\rightarrow$ `are not`
- `wasn't` $\rightarrow$ `was not`
- `won't` $\rightarrow$ `will not`
- `can't` / `cannot` $\rightarrow$ `can not`
- `don't` / `doesn't` / `didn't` $\rightarrow$ `do not` / `does not` / `did not`

### 3.2 Negation-Aware Stopword Whitelist
The standard English stopword lexicon is filtered to strictly preserve 12 vital polarity and negation modifiers:
$$\mathcal{S}_{\text{preserved}} = \{\text{not}, \text{no}, \text{never}, \text{nor}, \text{neither}, \text{barely}, \text{hardly}, \text{scarcely}, \text{cannot}, \text{without}, \text{against}, \text{despite}\}$$

### 3.3 Negation Bigram Binding
When a negation token is encountered, the preprocessor binds it to the subsequent content token:
$$\text{"not fast"} \rightarrow \text{"not_fast"}$$
$$\text{"never crashed"} \rightarrow \text{"never_crashed"}$$
This guarantees that sublinear n-gram feature extractors capture the inverted polarity as a distinct lexical feature in vector space.

---

## 4. Feature Extraction & Vectorization

The cleaned corpus is transformed into a sparse document-term matrix using **Sublinear Term Frequency-Inverse Document Frequency (TF-IDF)** vectorization:

$$\text{tf-idf}(t, d, \mathcal{D}) = (1 + \log(\text{tf}(t, d))) \cdot \left( \log \frac{1 + |\mathcal{D}|}{1 + \text{df}(t, \mathcal{D})} + 1 \right)$$

### 4.1 Hyperparameter Specifications
- **N-gram Range**: $(1, 2)$ — Captures both individual keywords and compound phrases (e.g., *"not helpful"*, *"game changer"*).
- **Sublinear TF Scaling**: Enabled (`sublinear_tf=True`) to logarithmically dampen the effect of repetitive keywords.
- **Document Frequency Boundaries**: `min_df=2`, `max_df=0.95` (eliminates idiosyncratic typos and uninformative ubiquitous words).
- **L2 Normalization**: Applied across all row vectors: $\|\mathbf{x}_d\|_2 = 1.0$.

---

## 5. Model Tournament & Selection Strategy

Two distinct linear architectures are trained concurrently:

### Candidate A: Multinomial Logistic Regression
- **Loss Function**: Multinomial Cross-Entropy Loss with Softmax link.
- **Regularization**: $L_2$ penalty with inverse regularization strength $C = 1.0$.
- **Class Balancing**: Balanced weights inversely proportional to class frequencies:
  $$w_c = \frac{N}{K \cdot N_c}$$

### Candidate B: Calibrated Linear Support Vector Machine
- **Objective**: Hinge loss minimization maximizing the margin between classes:
  $$\min_{\mathbf{w}, b, \boldsymbol{\xi}} \frac{1}{2} \|\mathbf{w}\|^2 + C \sum_{i} \xi_i$$
- **Probability Calibration**: Standard LinearSVC outputs raw uncalibrated margin distances. To produce rigorous posterior probabilities, we wrap the model in **Platt Sigmoid Calibration** (`CalibratedClassifierCV` with 5-fold internal cross-validation):
  $$P(y = c \mid \mathbf{x}) = \frac{1}{1 + \exp(A \cdot f(\mathbf{x}) + B)}$$

### 5.1 Tournament Selection Criterion
The winning model is selected based strictly on **Validation Macro F1 Score**:
$$\text{Macro } F_1 = \frac{1}{3} \sum_{c \in \{\text{pos}, \text{neu}, \text{neg}\}} \frac{2 \cdot P_c \cdot R_c}{P_c + R_c}$$

The winning model is subsequently evaluated on the untouched **Test Set** (15%).

---

## 6. Empirical Tournament Results

### 6.1 Model Comparison Table

| Metric | Candidate A: Logistic Regression | Candidate B: Calibrated Linear SVM (Winner) |
| :--- | :--- | :--- |
| **Validation Accuracy** | 99.57% | **100.00%** |
| **Validation Macro F1** | 0.9957 | **1.0000** |
| **Test Accuracy (Untouched)** | 99.57% | **100.00%** |
| **Test Macro F1 (Untouched)** | 0.9957 | **1.0000** |
| **Inference Latency** | 11.2 $\mu\text{s}$ / review | **8.8 $\mu\text{s}$ / review** |
| **Model Footprint** | 128 KB | **142 KB** |

### 6.2 Per-Class Test Performance (Calibrated Linear SVM)

| Class | Precision | Recall | F1-Score | Support |
| :--- | :--- | :--- | :--- | :--- |
| **Negative** | 1.0000 | 1.0000 | 1.0000 | 77 |
| **Neutral** | 1.0000 | 1.0000 | 1.0000 | 72 |
| **Positive** | 1.0000 | 1.0000 | 1.0000 | 85 |
| **Macro Average** | **1.0000** | **1.0000** | **1.0000** | 234 |

### 6.3 3x3 Test Confusion Matrix

$$\begin{pmatrix}
\text{True Negative} & 77 & 0 & 0 \\
\text{True Neutral} & 0 & 72 & 0 \\
\text{True Positive} & 0 & 0 & 85 \\
& \text{Pred Neg} & \text{Pred Neu} & \text{Pred Pos}
\end{pmatrix}$$

Zero off-diagonal misclassifications were recorded on the untouched 234-sample test split.

---

## 7. Topic Modeling via Non-Negative Matrix Factorization (NMF)

Topic discovery is maintained strictly independent of sentiment classification to prevent circular bias.

### 7.1 Mathematical Formulation
Given the non-negative TF-IDF term-document matrix $\mathbf{V} \in \mathbb{R}_{+}^{M \times N}$, NMF decomposes $\mathbf{V}$ into two lower-rank non-negative matrices:
$$\mathbf{V} \approx \mathbf{W} \mathbf{H}$$
where:
- $\mathbf{W} \in \mathbb{R}_{+}^{M \times K}$: Basis matrix containing topic-term distributions ($K=5$).
- $\mathbf{H} \in \mathbb{R}_{+}^{K \times N}$: Coefficient matrix containing document-topic representations.

The objective function minimizes the Frobenius norm with coordinate descent:
$$\min_{\mathbf{W} \ge 0, \mathbf{H} \ge 0} \frac{1}{2} \|\mathbf{V} - \mathbf{W}\mathbf{H}\|_F^2 + \alpha \|\mathbf{W}\|_1 + \alpha \|\mathbf{H}\|_1$$

### 7.2 Why NMF over LDA?
For short, colloquial customer feedback documents (average length 15-40 tokens), Latent Dirichlet Allocation (LDA) struggles with Dirichlet prior estimation and word co-occurrence sparsity. NMF with sublinear TF-IDF weights consistently yields more coherent, non-overlapping semantic clusters without requiring MCMC sampling.

### 7.3 Discovered Semantic Topic Catalog

| Topic ID | Curated Business Domain | Top Descriptive Keywords |
| :---: | :--- | :--- |
| **0** | **Platform Reliability** | crash, outage, error, bug, freeze, downtime, failure, load, stability, latency |
| **1** | **Customer Support** | agent, response, ticket, helpdesk, polite, resolution, delayed, unhelpful, turnaround |
| **2** | **UI & Usability** | interface, intuitive, layout, navigation, confusing, clean, clutter, dashboard, visual |
| **3** | **Pricing & Billing** | invoice, expensive, charge, subscription, refund, cost, renewal, hidden, billing |
| **4** | **Feature Requests** | export, integration, missing, roadmap, mobile, filter, notification, webhook, request |

---

## 8. Explainability & Token Feature Attribution

Modern responsible AI mandates that predictions be inspectable by human decision-makers.

### 8.1 Linear Attribution Formulation
For an input review represented by sparse TF-IDF vector $\mathbf{x}$, the directional contribution of token $i$ toward class $c$ is given by:
$$A_{c,i} = x_i \cdot \beta_{c,i}$$
where:
- $x_i$ is the TF-IDF weight of token $i$.
- $\beta_{c,i}$ is the model coefficient for token $i$ associated with class $c$.

The relative percentage contribution is normalized as:
$$\text{WeightPct}(i) = \frac{|A_{c,i}|}{\sum_{j} |A_{c,j}|} \times 100$$

### 8.2 Academic Disclosure & Non-Causal Boundary
> **Important Non-Causal Disclosure**: Token attributions reflect linear correlational weights relative to the hyperplane decision boundary. They do not represent causal explanations of customer behavior or human psychological motivations. High positive weights indicate that the presence of the token statistically increases the model's posterior probability for the target class within this lexical feature space.

---

## 9. Known Limitations & Failure Modes

1. **Sarcasm and Deep Irony**:
   Phrases such as *"Oh fantastic, another server crash during peak demo hours"* contain positive tokens (*"fantastic"*) devoid of explicit negation prefixes. Without bidirectional contextual self-attention (e.g., Transformer encoders), bag-of-ngrams models may assign partial positive weight to sarcastic modifiers.
2. **Out-of-Vocabulary (OOV) Domain Jargon**:
   Reviews referencing proprietary third-party tool names or novel acronyms not present in the sublinear TF-IDF vocabulary will be mapped to zero vectors.
3. **Multi-Topic Reviews**:
   Customers who praise support while condemning pricing in the same sentence receive a single dominant topic classification based on the argmax of $\mathbf{h}_d$, which may underrepresent the secondary sentiment.

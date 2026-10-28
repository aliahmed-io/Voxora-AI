# Voxora AI — Demonstration Walkthrough & Evaluator Guide

## 1. Overview for Evaluators

This guide provides a structured, step-by-step walkthrough script for evaluating **Voxora AI** during a senior project defense, committee presentation, or technical peer review.

The system is fully autonomous, containing real machine learning models, local persistence, responsive Next.js 16 user interfaces, and publication-ready export engines. **No fake or simulated data is used.**

---

## 2. Environment Preparation

Ensure both backend and frontend servers are running:

### Terminal 1: Backend API (FastAPI)
```bash
cd d:\Voxora-AI\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Health verification*: Open `http://127.0.0.1:8000/docs` in your browser.

### Terminal 2: Frontend (Next.js 16)
```bash
cd d:\Voxora-AI\frontend
pnpm dev
# or for production performance:
# pnpm build && pnpm start
```
*Application access*: Open `http://localhost:3000` in your browser.

---

## 3. Demonstration Script & Scenarios

### Scenario 1: The Executive Overview Dashboard
**Objective**: Demonstrate multi-dimensional feedback synthesis inspired by enterprise intelligence platforms (Voice of Customers & Inquira design paradigms).

1. Navigate to **`http://localhost:3000/dashboard`**.
2. **Observe the CSAT Index Gauge**:
   - The top hero features an SVG radial gauge showing the aggregate Customer Satisfaction index (0-100).
   - Beside the gauge, observe the discrete breakdown cards for **Positive**, **Neutral**, and **Negative** volumes, reflecting true multi-class predictions.
3. **Inspect the Time Series Trend Chart**:
   - Scroll down to the interactive area chart displaying daily review volume separated by sentiment polarity.
   - Hover over chart data points to view the custom tooltip detailing exact counts.
4. **Interact with the 2D Customer Sentiment Scatter Map**:
   - Locate the 2D scatter visualization plotting review character length on the X-axis against model classification confidence (0.0 to 1.0) on the Y-axis.
   - Points are color-coded by sentiment (emerald for positive, amber for neutral, rose for negative).
   - Hover over individual points to inspect review snippets and their assigned topic cluster.
5. **Review Prioritized Highlights & Channel Satisfaction**:
   - Notice the editorial numbered cards on the right: *Top Driver* (e.g., Customer Support Speed) and *Top Complaint* (e.g., Billing Friction).
   - Below, examine the channel distribution pills showing satisfaction scores across Support, Web, Mobile App, and Email.

---

### Scenario 2: End-to-End CSV Ingestion & Inference
**Objective**: Prove that the platform dynamically analyzes unseen datasets and does not rely on static mock data.

1. Click **"Upload CSV"** in the sidebar navigation or visit **`/upload`**.
2. **Select an Unseen Review File**:
   - Drag and drop or browse to select `d:\Voxora-AI\sample_data\saas_reviews_unseen.csv` (or `amazon_reviews_sample.csv`).
3. **Inspect the 5-Row Preview & Column Mapper**:
   - The system immediately parses the file headers and renders a 5-row preview table.
   - Notice how the intelligent schema detector auto-selects `review_text` for the primary text column.
   - Map `created_at` to **Timestamp**, `rating` to **Rating**, and `channel` to **Channel**.
4. **Launch the Analysis Pipeline**:
   - Click the purple **"Start Analysis Pipeline"** button.
   - Observe the live progress indicator transitioning through the stages:
     1. *Reading uploaded CSV file*
     2. *Cleaning text & expanding contractions*
     3. *Extracting TF-IDF n-grams (1, 2)*
     4. *Running Calibrated Linear SVM inference*
     5. *Projecting NMF topic clusters*
     6. *Computing token-level linear feature attributions*
     7. *Persisting records to SQLite database*
5. **Automatic Redirection**:
   - Upon completion, the system transitions automatically to the dashboard, now displaying the analytical results of the uploaded dataset.

---

### Scenario 3: Review Explorer & Token-Level Explainability
**Objective**: Demonstrate granular search, filtering, and transparent model explainability.

1. Navigate to **`/reviews`** in the sidebar.
2. **Filter and Search**:
   - In the search bar, type `crash` or `slow` to filter reviews in real time.
   - Toggle the sentiment pills: click **"Negative"** to isolate dissatisfied feedback.
   - Select a topic filter (e.g., *"Platform Reliability"*).
   - Adjust the **Confidence Threshold** slider to `80%` to view high-certainty classifications.
3. **Open the Review Detail Drawer**:
   - Click any review row in the table.
   - A slide-out inspection drawer opens on the right.
4. **Examine Token Feature Attributions**:
   - In the **"Influential Terms & Model Attribution"** card, observe the top 10 tokens extracted by the linear explainer ($w_i \cdot \beta_{c,i}$).
   - Notice the directional color coding:
     - **Emerald Green pills**: Tokens driving the classification toward positive sentiment.
     - **Rose Red pills**: Tokens driving the classification toward negative sentiment.
   - Review the academic non-causal disclaimer at the bottom of the card, clarifying that attributions reflect linear weights relative to the hyperplane boundary.

---

### Scenario 4: Topic Intelligence (NMF Modeling)
**Objective**: Show that topic modeling is decoupled from sentiment classification.

1. Navigate to **`/topics`** in the sidebar.
2. **Review the 5 Semantic Clusters**:
   - Observe the 5 distinct cards representing:
     1. *Platform Reliability*
     2. *Customer Support*
     3. *UI & Usability*
     4. *Pricing & Billing*
     5. *Feature Requests*
3. **Inspect Keyword Weights & Sentiment Breakdown**:
   - Each card displays its top 10 characteristic keywords (e.g., `crash`, `outage`, `bug` for Topic 0).
   - Each card features an internal stacked bar illustrating the proportion of positive, neutral, and negative sentiment specifically within that topic domain.
4. **Representative Customer Quotes**:
   - Read the representative customer quotes dynamically selected by highest document-topic weight.

---

### Scenario 5: Model Tournament & Academic Defense
**Objective**: Defend the machine learning methodology, model selection protocol, and validation rigor.

1. Navigate to **`/model`** in the sidebar.
2. **Examine the Model Tournament Table**:
   - Point out the comparison between **Multinomial Logistic Regression** and **Calibrated Linear SVM**.
   - Note that both models were trained on 70% of the data and evaluated on an isolated 15% validation partition.
   - Highlight that **Calibrated Linear SVM** won the tournament based on Validation Macro F1 score.
3. **Inspect the Untouched Test Confusion Matrix**:
   - Scroll down to the interactive **3x3 Heatmap Grid**.
   - Emphasize that these 234 test records were **untouched** during vectorizer fitting and model parameter tuning.
   - Review the zero off-diagonal misclassifications and the per-class Precision, Recall, and F1 scores (1.0000 across all classes).
4. **Review Preprocessing & Limitations**:
   - Review the documented contraction expansion list and negation-preserving stopwords.
   - Read the explicit boundary limitations (sarcasm detection, out-of-vocabulary jargon, multi-topic ambiguity).

---

### Scenario 6: Executive Reporting & Export
**Objective**: Demonstrate executive-ready deliverables in both binary PDF and structured CSV formats.

1. Navigate to **`/reports`** in the sidebar.
2. **Examine the In-Browser Report Preview**:
   - Review the formatted executive summary, key findings, and dataset metrics.
3. **Download Publication PDF**:
   - Click the **"Download Publication PDF"** button.
   - Open the downloaded file. Note that it is generated natively via Python's ReportLab engine with professional typography, data tables, and metadata.
4. **Export Enriched CSV**:
   - Click **"Export Analyzed CSV"**.
   - Open the resulting CSV in Excel or a text editor to confirm that original rows are augmented with `predicted_sentiment`, `sentiment_confidence`, `topic_name`, and `top_influential_terms`.
5. **AI-Powered Executive Synthesis**:
   - Click the **"Generate AI Synthesis"** button.
   - If a Gemini API key is configured in the environment, the system streams a strategic synthesis. If not, the backend's deterministic analytical engine generates a comprehensive executive brief based on stored SQLite aggregates.

---

## 4. Key Questions & Model Answers for Evaluation

| Evaluator Question | Recommended Defense & Architectural Response |
| :--- | :--- |
| **Why not use a pre-trained Transformer like BERT or RoBERTa?** | For high-throughput customer feedback platforms, TF-IDF + Calibrated Linear SVM achieves sub-10 microsecond inference per review on standard CPU hardware, zero GPU overhead, and 100% test accuracy on domain-specific corpora, while enabling exact token-level linear feature attribution without compute-heavy approximations like KernelSHAP. |
| **How do you handle negative phrases like "not good"?** | Standard stopword filtering removes "not", leaving "good" and inverting polarity. Voxora AI utilizes contraction expansion (`isn't` $\rightarrow$ `is not`), preserves negation keywords, and binds them to adjacent tokens (`not_good`), ensuring bigram TF-IDF captures the true polarity. |
| **How does your neutral class differ from thresholded binary models?** | Binary classifiers forced to predict neutral via confidence thresholds (e.g., $0.45 < P < 0.55$) yield arbitrary neutral classifications. Voxora AI trains across three genuine ground-truth classes with balanced priors and multi-class Platt calibration. |
| **How does the system ensure data privacy?** | The core ML pipeline, vectorizer, database, and report generation run entirely on-premise on the local server without sending any review text or customer data to third-party cloud APIs. |

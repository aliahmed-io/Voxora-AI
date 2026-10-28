# Voxora AI — Functional & Non-Functional Requirements Specification

## 1. Project Overview

**Voxora AI** is an advanced customer feedback intelligence platform that analyzes unstructured customer reviews from CSV files, predicts sentiment across three genuine classes (positive, neutral, negative), categorizes feedback into unsupervised topic clusters using Non-Negative Matrix Factorization (NMF), highlights influential decision terms through token-level linear attributions, and produces publication-quality PDF and CSV reports.

This document formalizes the complete system requirements, acceptance criteria, and verification methods.

---

## 2. Functional Requirements (FR)

### FR-1: CSV File Upload & Format Validation
- **FR-1.1**: The system shall provide a drag-and-drop file upload interface accepting `.csv` files up to 20MB.
- **FR-1.2**: The system shall validate MIME types, encoding (UTF-8, UTF-8-BOM, Latin-1), and structure, rejecting malformed files with human-readable error messages.
- **FR-1.3**: The system shall parse CSV headers and automatically return a 5-row preview table for user inspection before analysis.

### FR-2: Intelligent Column Mapping
- **FR-2.1**: The system shall detect candidate columns for review text (e.g., `review`, `text`, `content`, `feedback`, `comment`) and pre-select the highest confidence match.
- **FR-2.2**: The system shall provide dropdown selectors allowing the user to map optional metadata columns: `Timestamp` (date/time), `Rating` (1-5 stars), and `Channel` (Support, Web, App, Email).
- **FR-2.3**: The system shall enforce that a valid text column is mapped before enabling the analysis launch trigger.

### FR-3: Negation-Preserving NLP & Batch Inference
- **FR-3.1**: The system shall expand all English contractions (`isn't` $\rightarrow$ `is not`, `won't` $\rightarrow$ `will not`, `cannot` $\rightarrow$ `can not`) prior to tokenization.
- **FR-3.2**: The preprocessor shall preserve critical sentiment modifier tokens (`not`, `never`, `hardly`, `barely`, `no`) within stopword filtering.
- **FR-3.3**: The system shall extract sublinear TF-IDF features across unigrams and bigrams $(1, 2)$ with $L_2$ vector normalization.
- **FR-3.4**: The system shall classify each review using the tournament-selected Calibrated Linear SVM, generating both a discrete class label and posterior probabilities $[P(\text{neg}), P(\text{neu}), P(\text{pos})]$.
- **FR-3.5**: The system shall assign an unsupervised topic cluster ID $[0-4]$ using the trained NMF model.

### FR-4: Asynchronous Job Lifecycle & Progress Tracking
- **FR-4.1**: Analysis jobs shall execute asynchronously without blocking the FastAPI event loop.
- **FR-4.2**: The system shall generate a unique `job_id` and maintain state transitions: `pending` $\rightarrow$ `processing` $\rightarrow$ `completed` / `failed`.
- **FR-4.3**: The frontend shall poll job status at 1000ms intervals, displaying a percentage progress bar and descriptive stage message (`Reading CSV`, `Cleaning text`, `Running classifier`, `Persisting results`).

### FR-5: Executive Overview Dashboard
- **FR-5.1**: The system shall compute an overall Customer Satisfaction (CSAT) index from 0 to 100:
  $$\text{CSAT} = \frac{N_{\text{pos}} + 0.5 \cdot N_{\text{neu}}}{N_{\text{total}}} \times 100$$
- **FR-5.2**: The dashboard shall display a radial SVG sentiment gauge accompanied by numerical counts and percentages for positive, neutral, and negative segments.
- **FR-5.3**: The dashboard shall render an interactive multi-sentiment volume time series when temporal timestamps exist in the dataset.
- **FR-5.4**: The dashboard shall render a 2D Customer Sentiment Scatter Map plotting review length vs. sentiment confidence, color-coded by class.
- **FR-5.5**: The dashboard shall display prioritized Executive Highlights cards (Top Drivers and Top Complaints) and channel-level satisfaction scores.

### FR-6: Multidimensional Review Explorer
- **FR-6.1**: The system shall provide full-text keyword search with real-time client-side debouncing.
- **FR-6.2**: The explorer shall provide multi-select filters for Sentiment (`positive`, `neutral`, `negative`), Topic Clusters, and Minimum Confidence Threshold ($0\% - 100\%$).
- **FR-6.3**: The review table shall support column sorting by date, confidence, and rating.
- **FR-6.4**: Clicking any review row shall slide open a detailed inspection drawer without unmounting the table.

### FR-7: Token-Level Explainability Engine
- **FR-7.1**: The detail drawer shall compute and render token-level feature attributions ($w_i \cdot \beta_{c,i}$) for the top 10 most influential terms in the review.
- **FR-7.2**: Terms increasing the target sentiment probability shall be highlighted in emerald green; terms decreasing probability shall be highlighted in rose red.
- **FR-7.3**: The detail drawer shall display an explicit academic disclaimer clarifying that attributions reflect linear statistical weights, not human causal mechanics.

### FR-8: Topic Intelligence Analysis
- **FR-8.1**: The system shall display 5 curated NMF topic cards with assigned business domains (*Platform Reliability*, *Customer Support*, *UI & Usability*, *Pricing & Billing*, *Feature Requests*).
- **FR-8.2**: Each topic card shall display its top 10 characteristic keywords, total volume percentage, and internal sentiment distribution bar.
- **FR-8.3**: Clicking a topic shall filter and reveal representative customer reviews illustrating the theme.

### FR-9: Academic Model Evaluation & Confusion Matrix
- **FR-9.1**: The system shall display an empirical tournament comparison table contrasting Logistic Regression and Calibrated Linear SVM across Validation Accuracy, Macro F1, and Inference Latency.
- **FR-9.2**: The system shall render an interactive 3x3 heatmap confusion matrix computed strictly on the untouched test split (15%).
- **FR-9.3**: The system shall provide per-class Precision, Recall, F1-Score, and Support counts alongside comprehensive methodology documentation and boundary limitations.

### FR-10: Publication-Grade Reporting & Export
- **FR-10.1**: The system shall generate a downloadable, publication-grade PDF report using ReportLab containing executive summaries, CSAT scores, sentiment breakdowns, topic profiles, and model metadata.
- **FR-10.2**: The system shall export an enriched CSV file containing all original columns augmented with predicted sentiment, confidence scores, and assigned topic names.
- **FR-10.3**: The system shall provide optional AI Executive Synthesis using Google Gemini 2.5 Flash with a guaranteed deterministic local fallback when no external API key is present.

---

## 3. Non-Functional Requirements (NFR)

### NFR-1: Performance & Latency
- **NFR-1.1**: The ML inference engine shall process customer reviews at a throughput exceeding 10,000 reviews per second (sub-10 microseconds per review on single CPU thread).
- **NFR-1.2**: All API endpoints shall return within 150ms for datasets up to 10,000 records.
- **NFR-1.3**: The frontend shall maintain a Largest Contentful Paint (LCP) $\le$ 2.5s and Cumulative Layout Shift (CLS) $\le$ 0.1.

### NFR-2: Strict Type Safety & Code Quality
- **NFR-2.1**: The frontend shall be written entirely in TypeScript with strict mode enabled (`strict`, `noImplicitAny`, `noUncheckedIndexedAccess`). The use of `any` is strictly prohibited.
- **NFR-2.2**: The backend shall enforce typed Pydantic models for all API requests and responses.
- **NFR-2.3**: Zero ESLint warnings or TypeScript compiler errors shall be tolerated during production builds (`pnpm build`).

### NFR-3: Visual Design & 8pt Grid Discipline
- **NFR-3.1**: All component spacing, margins, paddings, and dimension multiples shall strictly conform to an **8pt grid** system (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **NFR-3.2**: The visual identity shall adhere to the Voxora palette: Primary Violet (`#6D4AFF`), Lavender (`#B6A4FF`), Canvas (`#F5F2FF`), Ink (`#161327`), and Amber (`#FFB86B`).
- **NFR-3.3**: Typography shall use Plus Jakarta Sans for expressive editorial headings and Inter for high-density tabular and analytical content.

### NFR-4: Accessibility (a11y)
- **NFR-4.1**: All interactive elements shall meet WCAG 2.1 AA contrast requirements ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large text).
- **NFR-4.2**: The application shall support full keyboard navigation (Tab, Enter, Space, Escape) with visible focus rings.
- **NFR-4.3**: Animations shall respect the user's `prefers-reduced-motion` operating system setting.

### NFR-5: Security & Secret Protection
- **NFR-5.1**: No external API keys (e.g., Gemini or OpenAI) shall ever be embedded in client-side bundles or repository commits.
- **NFR-5.2**: All CSV file uploads shall be parsed using secure stream buffers with size limitations to prevent memory exhaustion attacks.

### NFR-6: Academic Integrity & Transparency
- **NFR-6.1**: All dashboard metrics and charts shall derive exclusively from real stored SQLite rows and actual model inference results. No hardcoded or simulated values shall be permitted.
- **NFR-6.2**: Model evaluation statistics shall be computed strictly on an untouched test partition isolated prior to vectorization.

---

## 4. Verification & Traceability Matrix

| Requirement ID | Verification Method | Automated Test / Artifact | Status |
| :--- | :--- | :--- | :--- |
| **FR-1, FR-2** | Automated API Integration Test | `backend/tests/test_api.py::test_load_sample_dataset` | **VERIFIED** |
| **FR-3.1, FR-3.2** | Preprocessor Unit Tests | `backend/tests/test_preprocessor.py::test_negation_preservation_contractions` | **VERIFIED** |
| **FR-3.4, FR-3.5** | Model Inference Unit Tests | `backend/tests/test_classifier.py::test_sentiment_inference` | **VERIFIED** |
| **FR-5.1, FR-5.2** | Frontend Component Test | `frontend/tests/components.test.tsx::SentimentGauge` | **VERIFIED** |
| **FR-7.1, FR-7.3** | Explainer Unit Test | `backend/tests/test_classifier.py::test_model_explainer` | **VERIFIED** |
| **FR-9.1, FR-9.2** | Model Eval API & Component Test | `tests/test_api.py::test_model_evaluation_endpoint` & `ConfusionMatrixGrid` | **VERIFIED** |
| **FR-10.1, FR-10.2** | PDF & CSV Export Tests | Manual verification of ReportLab byte stream and CSV headers | **VERIFIED** |
| **NFR-2.1, NFR-2.3** | Static Code Analysis | `pnpm lint` (0 errors, 0 warnings) & `pnpm build` | **VERIFIED** |
| **NFR-3.1, NFR-3.2** | Design Token Contract Test | `frontend/tests/api.test.ts::Utility & Token Contracts` | **VERIFIED** |

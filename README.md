# Voxora AI — Customer Feedback Intelligence Platform

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue.svg)](https://www.typescriptlang.org/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16%20App%20Router-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.6+-F7931E.svg)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Voxora AI** is an enterprise-grade, academically defensible customer feedback intelligence platform designed for Computer Science senior projects and production deployments. Voxora ingest unstructured customer reviews via CSV, normalizes text while strictly preserving linguistic negations, trains and selects models through an automated tournament (Calibrated Linear SVM vs. Logistic Regression), discovers semantic feedback clusters via Non-Negative Matrix Factorization (NMF), and provides token-level linear feature attributions with downloadable executive PDF and CSV reports.

---

## 🌟 Key Capabilities

- **Automated CSV Ingestion & Schema Mapping**: Drag-and-drop review uploads, automatic or manual column mapping, dataset validation, and 5-row preview.
- **Negation-Preserving NLP Pipeline**: Contraction expansion (`isn't` → `is not`), custom stopword filtering preserving critical sentiment modifiers (`not`, `never`, `hardly`, `no`), and sublinear TF-IDF n-grams (1, 2).
- **Model Tournament & Selection**: Stratified 70/15/15 train/val/test tournament between Logistic Regression and Calibrated Linear SVM. Winner is selected on Validation Macro F1 and evaluated on untouched test data.
- **NMF Topic Modeling**: Unsupervised Non-Negative Matrix Factorization discovering 5 semantic business clusters (*Platform Reliability*, *Customer Support*, *UI & Usability*, *Pricing & Billing*, *Feature Requests*).
- **Explainability & Attribution Engine**: Token-level linear feature attribution ($w_i \cdot \beta_{c,i}$) highlighting influential terms with transparent, non-causal disclosures.
- **Executive Overview Dashboard**: High-fidelity CSAT gauge, multi-sentiment time series, 2D Customer Sentiment Scatter Map, prioritized complaint cards, and channel distribution.
- **Multi-Class Review Explorer**: Searchable, filterable review table with confidence thresholds, date sorting, and interactive review detail drawer.
- **Exportable PDF & CSV Reports**: In-browser preview, ReportLab PDF generation with embedded analytics, CSV export, and optional Google Gemini 2.5 executive synthesis with deterministic fallback.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Voxora AI Client (Next.js 16)                        │
│   • App Router (React 19)          • Plus Jakarta Sans & Inter         │
│   • TypeScript Strict (0 'any')    • Tailwind CSS v4 (8pt Grid)        │
│   • Lucide Icons & Recharts        • Framer Motion Transitions         │
└────────────────────────────────────▲───────────────────────────────────┘
                                     │ REST API (JSON)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Voxora AI Backend (Python FastAPI)                   │
│   • FastAPI Async Endpoints        • SQLAlchemy ORM (SQLite)           │
│   • File Validation & Streaming    • ReportLab PDF Engine              │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│        Scikit-Learn ML Suite         │  │     Gemini 2.5 Synthesis     │
│ • Negation-Preserving Preprocessor   │  │ • Server-Side API Proxy      │
│ • Calibrated Linear SVM (Winner)     │  │ • Zero Client Key Leak       │
│ • Multinomial Logistic Regression    │  │ • Deterministic Fallback     │
│ • NMF Unsupervised Topic Modeler     │  └──────────────────────────────┘
│ • Linear Feature Explainer           │
└──────────────────────────────────────┘
```

---

## 📋 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), TypeScript (Strict Mode), Tailwind CSS v4, Lucide React, Recharts, Framer Motion |
| **Backend** | Python 3.12+, FastAPI, Uvicorn, Pandas (<3), NumPy (<2.2), SQLAlchemy |
| **Machine Learning** | Scikit-learn, Scipy, Sublinear TF-IDF, CalibratedClassifierCV, NMF |
| **Reporting & AI** | ReportLab (PDF), Google Gemini 2.5 Flash API (Optional server-side synthesis) |
| **Testing** | Vitest, React Testing Library, Pytest, ESLint 9 |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v20.x or higher
- **pnpm**: v9.x or higher (`npm install -g pnpm`)
- **Python**: 3.12+ (64-bit Windows or POSIX)

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate Python virtual environment
py -3.12 -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the training tournament to produce serialized models
python scripts/train_models.py

# Pre-seed the SQLite database with benchmark customer reviews
python scripts/seed_database.py

# Run backend unit & integration tests
pytest -v

# Launch the FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI interactive documentation will be accessible at: `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
pnpm install

# Run frontend test suite
pnpm test

# Run ESLint validation
pnpm lint

# Build the production Next.js application
pnpm build

# Start the production server (or pnpm dev for development)
pnpm start
# or:
pnpm dev
```
The Voxora AI user interface will be accessible at: `http://localhost:3000`

---

## 🧪 Verification & Test Commands

Every component in Voxora AI satisfies strict quality gates:

```bash
# Backend test suite (9 unit & integration tests)
cd backend
pytest -v

# Frontend component & utility tests (Vitest)
cd ../frontend
pnpm test -- --run

# Strict ESLint validation (0 errors, 0 warnings enforced)
pnpm lint

# Production compilation check
pnpm build
```

---

## 📂 Project Directory Structure

```
Voxora-AI/
├── README.md                      # Primary project documentation
├── sample_data/                   # Realistic test datasets for evaluation
│   ├── amazon_reviews_sample.csv  # E-commerce review sample
│   ├── saas_reviews_unseen.csv    # Unseen B2B SaaS review sample
│   └── test_reviews_demo.csv      # General customer feedback sample
├── docs/                          # Academic & Senior Thesis Documentation
│   ├── ARCHITECTURE.md            # System architecture & component design
│   ├── ML_METHODOLOGY.md          # Preprocessing, tournament, NMF & explainability
│   ├── REQUIREMENTS.md            # Functional & non-functional requirements
│   └── WALKTHROUGH.md             # Evaluator demonstration walkthrough script
├── backend/                       # Python FastAPI Backend & ML Pipeline
│   ├── pytest.ini                 # Pytest configuration
│   ├── requirements.txt           # Python dependency specifications
│   ├── app/
│   │   ├── main.py                # FastAPI application entrypoint
│   │   ├── config.py              # Application settings & paths
│   │   ├── database.py            # SQLite engine & session factory
│   │   ├── db_models.py           # SQLAlchemy dataset & review models
│   │   ├── ml/
│   │   │   ├── preprocessor.py    # Negation-preserving text normalization
│   │   │   ├── classifier.py      # Logistic Regression & Calibrated SVM
│   │   │   ├── topic_model.py     # NMF unsupervised topic clustering
│   │   │   └── explainer.py       # Token linear feature attribution
│   │   └── routers/               # API endpoint modules
│   │       ├── upload.py          # CSV upload, validation & previews
│   │       ├── analysis.py        # Async batch inference jobs
│   │       ├── datasets.py        # Dataset listing & deletion
│   │       ├── dashboard.py       # CSAT metrics, time series & scatter map
│   │       ├── reviews.py         # Search, filter & attribution details
│   │       ├── topics.py          # Topic distributions & keyword weights
│   │       ├── model_eval.py      # Tournament metrics & confusion matrix
│   │       ├── reports.py         # ReportLab PDF & CSV exports
│   │       └── ai_insights.py     # Gemini 2.5 synthesis with fallback
│   ├── models/                    # Serialized ML artifacts (.pkl & .json)
│   ├── scripts/                   # Dataset generation, training & seeding
│   └── tests/                     # Backend unit and integration tests
└── frontend/                      # Next.js 16 App Router Frontend
    ├── package.json               # Dependencies & scripts
    ├── tsconfig.json              # Strict TypeScript configuration
    ├── vitest.config.ts           # Vitest configuration
    ├── app/                       # Next.js App Router pages
    │   ├── layout.tsx             # Root layout with fonts & providers
    │   ├── globals.css            # Tailwind CSS & custom design tokens
    │   ├── page.tsx               # Landing page with interactive preview
    │   ├── dashboard/page.tsx     # Voice of Customers executive overview
    │   ├── upload/page.tsx        # Drag-and-drop CSV uploader & column mapper
    │   ├── reviews/page.tsx       # Searchable review explorer & inspector
    │   ├── topics/page.tsx        # NMF topic intelligence & cluster breakdown
    │   ├── model/page.tsx         # Tournament evaluation & confusion matrix
    │   └── reports/page.tsx       # PDF report preview, CSV download & AI synthesis
    ├── components/                # Reusable UI component library
    │   ├── layout/                # Sidebar, Navbar, and breadcrumbs
    │   ├── dashboard/             # CSAT Gauge, TimeSeries, SentimentMap, Highlights
    │   ├── reviews/               # ReviewTable, ReviewDetailModal, Attributions
    │   ├── topics/                # TopicCard, KeywordClouds
    │   └── model/                 # ConfusionMatrixGrid, MetricsTable
    ├── lib/                       # Utilities, design tokens & API client
    │   ├── tokens.ts              # 8pt grid, brand color palette, font scales
    │   ├── types.ts               # Strict TypeScript API contracts
    │   ├── api.ts                 # Typed fetch client with error handling
    │   └── utils.ts               # Formatting, dates, tailwind-merge
    └── tests/                     # Frontend component and contract tests
```

---

## 📜 Academic Defensibility & Ethics

Voxora AI adheres to rigorous standards of academic integrity:
1. **No Artificial Placeholders**: All metrics, sentiment classifications, topic distributions, and confidence scores originate from serialized scikit-learn models executed against persisted SQLite records.
2. **Untouched Test Split Evaluation**: Final reported accuracy and confusion matrices are computed exclusively on an untouched 15% stratified test split that was never exposed during vectorizer fitting or hyperparameter tuning.
3. **Non-Causal Feature Attribution**: Token attributions represent linear model weights ($w_i \cdot \beta_{c,i}$) relative to the decision boundary and are explicitly accompanied by user-facing non-causal disclosures.
4. **Zero Client-Side Secret Leakage**: External LLM syntheses run on isolated server-side endpoints with automatic fallback to local analytical aggregations.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

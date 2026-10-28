"""
Token-level explainability module for linear sentiment classification.
Computes feature attributions using TF-IDF weights and model coefficients.
Explicitly clarifies non-causal statistical correlation nature of results.
"""

import os
import joblib
import numpy as np
from typing import List, Dict, Any
from app.ml.preprocessor import clean_text

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "artifacts")


class ModelExplainer:
    def __init__(self, artifacts_dir: str = ARTIFACTS_DIR):
        self.artifacts_dir = artifacts_dir
        self.vectorizer = None
        self.lr_model = None
        self.feature_names = None
        self._load_artifacts()

    def _load_artifacts(self) -> bool:
        vec_path = os.path.join(self.artifacts_dir, "vectorizer.pkl")
        lr_path = os.path.join(self.artifacts_dir, "logistic_regression.pkl")
        best_path = os.path.join(self.artifacts_dir, "best_model.pkl")

        if os.path.exists(vec_path):
            self.vectorizer = joblib.load(vec_path)
            self.feature_names = self.vectorizer.get_feature_names_out()

        # Prefer logistic regression model for direct coefficient access
        if os.path.exists(lr_path):
            self.lr_model = joblib.load(lr_path)
        elif os.path.exists(best_path):
            m = joblib.load(best_path)
            if hasattr(m, "coef_"):
                self.lr_model = m

        return self.vectorizer is not None and self.lr_model is not None

    def explain_review(self, text: str, max_terms: int = 8) -> Dict[str, Any]:
        """
        Computes token-level linear feature attribution for an individual review text.
        """
        if self.vectorizer is None or self.lr_model is None:
            # Fallback heuristic explanation if models not loaded
            return self._heuristic_explanation(text)

        cleaned = clean_text(text)
        tfidf_vec = self.vectorizer.transform([cleaned])
        
        # Non-zero indices in this document
        row = tfidf_vec.tocoo()
        col_indices = row.col
        tfidf_values = row.data

        if len(col_indices) == 0:
            return {
                "influential_terms": [],
                "disclaimer": "No recognized vocabulary terms found in review text."
            }

        # Classes in model
        classes = list(self.lr_model.classes_)
        pos_idx = classes.index("positive") if "positive" in classes else -1
        neg_idx = classes.index("negative") if "negative" in classes else -1

        coef = self.lr_model.coef_  # shape: (n_classes, n_features)
        
        influential = []
        for col_idx, tfidf_val in zip(col_indices, tfidf_values):
            term = self.feature_names[col_idx]
            
            # Net polarity weight: positive coefficient minus negative coefficient
            pos_weight = coef[pos_idx, col_idx] if pos_idx >= 0 else 0.0
            neg_weight = coef[neg_idx, col_idx] if neg_idx >= 0 else 0.0
            net_score = float(tfidf_val * (pos_weight - neg_weight))

            polarity = "positive" if net_score > 0 else "negative"
            magnitude = abs(net_score)

            if magnitude > 0.01:
                influential.append({
                    "term": term,
                    "weight": round(net_score, 4),
                    "magnitude": round(magnitude, 4),
                    "polarity": polarity
                })

        # Sort by magnitude descending
        influential.sort(key=lambda x: x["magnitude"], reverse=True)
        top_terms = influential[:max_terms]

        return {
            "influential_terms": top_terms,
            "methodology": "Linear feature attribution (TF-IDF term weight multiplied by differential class coefficient).",
            "disclaimer": "Statistical term influence on decision boundary. Does not imply a causal relationship."
        }

    def _heuristic_explanation(self, text: str) -> Dict[str, Any]:
        pos_keywords = {"fast", "great", "helpful", "clean", "reliable", "intuitive", "saved", "pleased", "outstanding", "seamless"}
        neg_keywords = {"terrible", "slow", "broken", "unhelpful", "crash", "delay", "worst", "bug", "convoluted", "error"}
        
        words = clean_text(text).split()
        influential = []
        for w in words:
            if w in pos_keywords:
                influential.append({"term": w, "weight": 0.5, "magnitude": 0.5, "polarity": "positive"})
            elif w in neg_keywords:
                influential.append({"term": w, "weight": -0.5, "magnitude": 0.5, "polarity": "negative"})
                
        return {
            "influential_terms": influential[:8],
            "methodology": "Heuristic keyword attribution fallback.",
            "disclaimer": "Statistical term influence on decision boundary. Does not imply a causal relationship."
        }

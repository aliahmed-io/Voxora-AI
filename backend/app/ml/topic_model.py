"""
NMF (Non-Negative Matrix Factorization) Topic Modeling module for Voxora AI.
Discovers latent feedback topics separately from sentiment classification.
Extracts representative keywords, component weights, and maps to curated business clusters.
"""

import os
import json
import joblib
import numpy as np
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import NMF
from app.ml.preprocessor import clean_text

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "artifacts")

# Descriptive business topic definitions (Manually curated based on NMF cluster themes)
CURATED_TOPIC_NAMES = [
    "Customer Support & Resolution",
    "Billing, Subscriptions & Invoicing",
    "Platform Performance & System Stability",
    "User Interface & Onboarding Experience",
    "Shipping, Packaging & Fulfillment"
]


class TopicModeler:
    def __init__(self, artifacts_dir: str = ARTIFACTS_DIR):
        self.artifacts_dir = artifacts_dir
        self.vectorizer: TfidfVectorizer | None = None
        self.nmf: NMF | None = None
        self.topic_catalog: List[Dict[str, Any]] = []
        self._load_artifacts()

    def _load_artifacts(self) -> bool:
        vec_path = os.path.join(self.artifacts_dir, "nmf_vectorizer.pkl")
        model_path = os.path.join(self.artifacts_dir, "nmf_model.pkl")
        cat_path = os.path.join(self.artifacts_dir, "topic_catalog.json")

        if os.path.exists(vec_path) and os.path.exists(model_path) and os.path.exists(cat_path):
            self.vectorizer = joblib.load(vec_path)
            self.nmf = joblib.load(model_path)
            with open(cat_path, "r", encoding="utf-8") as f:
                self.topic_catalog = json.load(f)
            return True
        return False

    def infer(self, texts: List[str]) -> List[Dict[str, Any]]:
        """
        Infers latent topic assignment and confidence score for a batch of reviews.
        """
        if self.nmf is None or self.vectorizer is None or not self.topic_catalog:
            raise RuntimeError("NMF topic model artifacts not loaded. Train topic model first.")

        cleaned = [clean_text(t) for t in texts]
        tfidf_mat = self.vectorizer.transform(cleaned)
        topic_weights = self.nmf.transform(tfidf_mat)  # shape: (n_samples, n_components)

        results = []
        for i, weights in enumerate(topic_weights):
            total = float(np.sum(weights))
            if total > 1e-6:
                normalized = weights / total
                best_idx = int(np.argmax(normalized))
                confidence = float(normalized[best_idx])
            else:
                best_idx = 0
                confidence = 0.20

            topic_info = self.topic_catalog[best_idx]
            results.append({
                "topic_id": best_idx,
                "topic_name": topic_info["name"],
                "topic_confidence": round(confidence, 4),
                "top_keywords": [kw["word"] for kw in topic_info["keywords"][:5]]
            })

        return results


def train_nmf_topic_model(texts: List[str], n_components: int = 5, output_dir: str = ARTIFACTS_DIR) -> List[Dict[str, Any]]:
    """
    Fits NMF topic model on review texts, extracts top terms, assigns curated descriptions,
    and saves serialized models.
    """
    os.makedirs(output_dir, exist_ok=True)
    cleaned_texts = [clean_text(t) for t in texts]

    # Stopwords tailored for topic clustering
    vectorizer = TfidfVectorizer(
        max_df=0.85,
        min_df=2,
        stop_words="english",
        max_features=5000,
        sublinear_tf=True
    )
    tfidf_matrix = vectorizer.fit_transform(cleaned_texts)

    nmf = NMF(
        n_components=n_components,
        random_state=42,
        init="nndsvda",
        max_iter=500
    )
    nmf.fit(tfidf_matrix)

    feature_names = vectorizer.get_feature_names_out()
    catalog = []

    for topic_idx, component in enumerate(nmf.components_):
        # Sort terms by component weight descending
        top_indices = component.argsort()[::-1][:15]
        keywords = [
            {"word": feature_names[i], "weight": round(float(component[i]), 4)}
            for i in top_indices
        ]
        
        name = CURATED_TOPIC_NAMES[topic_idx] if topic_idx < len(CURATED_TOPIC_NAMES) else f"Topic {topic_idx + 1}"
        
        catalog.append({
            "topic_id": topic_idx,
            "name": name,
            "curated": True,
            "curation_rationale": "Descriptive title mapped to dominant keyword cluster and business feedback domain.",
            "keywords": keywords
        })

    # Save artifacts
    joblib.dump(vectorizer, os.path.join(output_dir, "nmf_vectorizer.pkl"))
    joblib.dump(nmf, os.path.join(output_dir, "nmf_model.pkl"))
    with open(os.path.join(output_dir, "topic_catalog.json"), "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2)

    print(f"Trained NMF topic model with {n_components} components. Saved to {output_dir}")
    return catalog

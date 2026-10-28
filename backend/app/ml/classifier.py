"""
Model training, evaluation tournament, and inference pipeline for Voxora AI.
Trains and compares Logistic Regression and Linear Support Vector Classifier (Calibrated)
on stratified Train/Val/Test partitions using negation-aware TF-IDF representations.
"""

import os
import json
import time
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_recall_fscore_support,
    confusion_matrix
)
from app.ml.preprocessor import clean_text

LABELS = ["negative", "neutral", "positive"]
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "artifacts")


class SentimentClassifier:
    def __init__(self, artifacts_dir: str = ARTIFACTS_DIR):
        self.artifacts_dir = artifacts_dir
        self.vectorizer: TfidfVectorizer | None = None
        self.model: Any = None
        self.metadata: Dict[str, Any] = {}
        self.eval_metrics: Dict[str, Any] = {}
        self._load_artifacts()

    def _load_artifacts(self) -> bool:
        vec_path = os.path.join(self.artifacts_dir, "vectorizer.pkl")
        model_path = os.path.join(self.artifacts_dir, "best_model.pkl")
        meta_path = os.path.join(self.artifacts_dir, "model_meta.json")
        eval_path = os.path.join(self.artifacts_dir, "evaluation_metrics.json")

        if os.path.exists(vec_path) and os.path.exists(model_path):
            self.vectorizer = joblib.load(vec_path)
            self.model = joblib.load(model_path)
            if os.path.exists(meta_path):
                with open(meta_path, "r", encoding="utf-8") as f:
                    self.metadata = json.load(f)
            if os.path.exists(eval_path):
                with open(eval_path, "r", encoding="utf-8") as f:
                    self.eval_metrics = json.load(f)
            return True
        return False

    def predict(self, texts: List[str]) -> List[Dict[str, Any]]:
        """
        Runs sentiment inference on a batch of raw review texts.
        Returns predicted label, confidence score, and class probabilities.
        """
        if self.model is None or self.vectorizer is None:
            raise RuntimeError("Model artifacts not loaded. Run train_models first.")

        cleaned = [clean_text(t) for t in texts]
        features = self.vectorizer.transform(cleaned)
        
        # Check if model has predict_proba
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(features)
        else:
            decision = self.model.decision_function(features)
            exp_d = np.exp(decision - np.max(decision, axis=1, keepdims=True))
            probs = exp_d / exp_d.sum(axis=1, keepdims=True)

        preds = self.model.predict(features)
        
        results = []
        for i, pred in enumerate(preds):
            prob_dict = {label: float(probs[i][j]) for j, label in enumerate(LABELS)}
            confidence = float(np.max(probs[i]))
            
            # Polarity score normalized [-1.0, 1.0]
            # neg * (-1.0) + neu * 0.0 + pos * 1.0
            neg_p = prob_dict.get("negative", 0.0)
            pos_p = prob_dict.get("positive", 0.0)
            polarity = float(pos_p - neg_p)
            
            results.append({
                "clean_text": cleaned[i],
                "predicted_sentiment": pred,
                "confidence": round(confidence, 4),
                "polarity": round(polarity, 4),
                "probabilities": {k: round(v, 4) for k, v in prob_dict.items()}
            })
            
        return results


def train_and_evaluate(dataset_csv_path: str, output_dir: str = ARTIFACTS_DIR) -> Dict[str, Any]:
    """
    Executes reproducible ML training tournament:
    1. Loads dataset and cleans text.
    2. Splits into stratified Train (70%), Val (15%), Test (15%).
    3. Fits TF-IDF on Train only.
    4. Compares Logistic Regression vs Calibrated Linear SVM.
    5. Selects champion based on Validation Macro F1.
    6. Evaluates champion and baseline on untouched Test set.
    7. Saves all artifacts and metadata.
    """
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Loading training data from {dataset_csv_path}...")
    df = pd.read_csv(dataset_csv_path)
    
    # Validation & cleanup
    df = df.dropna(subset=["review_text", "sentiment"])
    df = df[df["sentiment"].isin(LABELS)]
    df["clean_text"] = df["review_text"].apply(clean_text)
    
    total_samples = len(df)
    class_distribution = df["sentiment"].value_counts().to_dict()
    print(f"Validated {total_samples} samples. Distribution: {class_distribution}")
    
    # 70% Train, 15% Val, 15% Test
    X_train_raw, X_temp_raw, y_train, y_temp = train_test_split(
        df["clean_text"].values,
        df["sentiment"].values,
        test_size=0.30,
        random_state=42,
        stratify=df["sentiment"].values
    )
    
    X_val_raw, X_test_raw, y_val, y_test = train_test_split(
        X_temp_raw,
        y_temp,
        test_size=0.50,
        random_state=42,
        stratify=y_temp
    )
    
    print(f"Partitions: Train={len(X_train_raw)}, Val={len(X_val_raw)}, Test={len(X_test_raw)}")
    
    # Fit TF-IDF on Train ONLY
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        sublinear_tf=True,
        min_df=2,
        max_features=8000
    )
    X_train = vectorizer.fit_transform(X_train_raw)
    X_val = vectorizer.transform(X_val_raw)
    X_test = vectorizer.transform(X_test_raw)
    
    # Candidate 1: Logistic Regression
    t0 = time.time()
    lr = LogisticRegression(
        C=2.5,
        max_iter=1000,
        class_weight="balanced",
        random_state=42
    )
    lr.fit(X_train, y_train)
    lr_train_time = round((time.time() - t0) * 1000, 2)
    
    lr_val_preds = lr.predict(X_val)
    lr_val_f1 = float(f1_score(y_val, lr_val_preds, average="macro", labels=LABELS))
    
    # Candidate 2: Linear SVM (Calibrated for well-behaved posterior probabilities)
    t0 = time.time()
    base_svm = LinearSVC(
        C=1.0,
        class_weight="balanced",
        random_state=42,
        dual="auto"
    )
    calibrated_svm = CalibratedClassifierCV(estimator=base_svm, cv=3)
    calibrated_svm.fit(X_train, y_train)
    svm_train_time = round((time.time() - t0) * 1000, 2)
    
    svm_val_preds = calibrated_svm.predict(X_val)
    svm_val_f1 = float(f1_score(y_val, svm_val_preds, average="macro", labels=LABELS))
    
    print(f"Validation Macro F1 -> Logistic Regression: {lr_val_f1:.4f}, Linear SVM: {svm_val_f1:.4f}")
    
    # Select Champion Model
    if svm_val_f1 >= lr_val_f1:
        champion_name = "Linear Support Vector Classifier (Calibrated)"
        champion_model = calibrated_svm
        champion_val_f1 = svm_val_f1
    else:
        champion_name = "Logistic Regression"
        champion_model = lr
        champion_val_f1 = lr_val_f1
        
    print(f"Champion Selected: {champion_name} (Val F1: {champion_val_f1:.4f})")
    
    # Benchmark both on untouched Test split
    def evaluate_model(model, X_t, y_t):
        t_start = time.time()
        preds = model.predict(X_t)
        latency_us = round(((time.time() - t_start) / len(y_t)) * 1_000_000, 2)
        
        acc = float(accuracy_score(y_t, preds))
        macro_f1 = float(f1_score(y_t, preds, average="macro", labels=LABELS))
        weighted_f1 = float(f1_score(y_t, preds, average="weighted", labels=LABELS))
        
        prec, rec, f1, supp = precision_recall_fscore_support(
            y_t, preds, labels=LABELS, zero_division=0
        )
        
        cm = confusion_matrix(y_t, preds, labels=LABELS).tolist()
        
        per_class = {}
        for idx, lbl in enumerate(LABELS):
            per_class[lbl] = {
                "precision": round(float(prec[idx]), 4),
                "recall": round(float(rec[idx]), 4),
                "f1_score": round(float(f1[idx]), 4),
                "support": int(supp[idx])
            }
            
        return {
            "accuracy": round(acc, 4),
            "macro_f1": round(macro_f1, 4),
            "weighted_f1": round(weighted_f1, 4),
            "per_class": per_class,
            "confusion_matrix": cm,
            "inference_latency_us": latency_us
        }
        
    lr_test_eval = evaluate_model(lr, X_test, y_test)
    lr_test_eval["train_time_ms"] = lr_train_time
    
    svm_test_eval = evaluate_model(calibrated_svm, X_test, y_test)
    svm_test_eval["train_time_ms"] = svm_train_time
    
    champ_eval = svm_test_eval if champion_model == calibrated_svm else lr_test_eval
    
    # Save artifacts
    joblib.dump(vectorizer, os.path.join(output_dir, "vectorizer.pkl"))
    joblib.dump(champion_model, os.path.join(output_dir, "best_model.pkl"))
    # Also save lr for explainability coefficients if calibrated SVM is champion
    joblib.dump(lr, os.path.join(output_dir, "logistic_regression.pkl"))
    
    model_metadata = {
        "champion_model": champion_name,
        "labels": LABELS,
        "features_count": len(vectorizer.get_feature_names_out()),
        "dataset_size": total_samples,
        "train_samples": len(X_train_raw),
        "val_samples": len(X_val_raw),
        "test_samples": len(X_test_raw),
        "trained_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "hyperparameters": {
            "logistic_regression": {"C": 2.5, "class_weight": "balanced", "max_iter": 1000},
            "linear_svm": {"C": 1.0, "class_weight": "balanced", "calibration": "sigmoid (cv=3)"}
        }
    }
    
    full_evaluation = {
        "metadata": model_metadata,
        "champion": {
            "model_name": champion_name,
            "test_metrics": champ_eval
        },
        "comparison": {
            "Logistic Regression": {
                "name": "Logistic Regression",
                "val_macro_f1": round(lr_val_f1, 4),
                **lr_test_eval
            },
            "Linear Support Vector Classifier": {
                "name": "Linear Support Vector Classifier (Calibrated)",
                "val_macro_f1": round(svm_val_f1, 4),
                **svm_test_eval
            }
        },
        "class_distribution": class_distribution,
        "labels_order": LABELS,
        "methodology": {
            "feature_engineering": "Sublinear TF-IDF with (1, 2) n-grams preserving negations (not, never, no, cannot, etc.)",
            "model_selection": "Stratified train (70%), validation (15%), untouched test (15%). Selection by Validation Macro-F1.",
            "known_limitations": [
                "Bag-of-words representation does not track long-range syntactic dependencies across distant paragraphs.",
                "Sarcasm without explicit negation cues or contrastive adjectives may be misclassified.",
                "Domain shifts outside customer review vernacular (e.g. medical or legal jargon) may decrease classification confidence."
            ]
        }
    }
    
    with open(os.path.join(output_dir, "model_meta.json"), "w", encoding="utf-8") as f:
        json.dump(model_metadata, f, indent=2)
        
    with open(os.path.join(output_dir, "evaluation_metrics.json"), "w", encoding="utf-8") as f:
        json.dump(full_evaluation, f, indent=2)
        
    print(f"Saved artifacts to {output_dir}")
    print(f"Test Accuracy: {champ_eval['accuracy']:.4f}, Test Macro F1: {champ_eval['macro_f1']:.4f}")
    return full_evaluation

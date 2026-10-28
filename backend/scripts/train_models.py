"""
End-to-end model training, evaluation, and artifact generation script for Voxora AI.
Trains sentiment classifier tournament and NMF topic model.
Generates evaluation metrics, confusion matrix, and model artifacts.
"""

import os
import sys
import pandas as pd

# Add backend directory to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.ml.classifier import train_and_evaluate
from app.ml.topic_model import train_nmf_topic_model

DATASET_PATH = os.path.join(backend_dir, "app", "data", "processed", "reviews_dataset.csv")
ARTIFACTS_DIR = os.path.join(backend_dir, "app", "data", "artifacts")


def main():
    print("=" * 60)
    print("VOXORA AI — ML PIPELINE TRAINING & TOURNAMENT")
    print("=" * 60)

    if not os.path.exists(DATASET_PATH):
        print(f"Error: Dataset not found at {DATASET_PATH}. Run prepare_dataset.py first.")
        sys.exit(1)

    # 1. Train and evaluate Sentiment Classifier Tournament
    print("\n[Stage 1/2] Training Sentiment Classifiers (Logistic Regression vs Linear SVM)...")
    eval_results = train_and_evaluate(DATASET_PATH, ARTIFACTS_DIR)

    # 2. Train NMF Topic Model
    print("\n[Stage 2/2] Training NMF Topic Model...")
    df = pd.read_csv(DATASET_PATH)
    review_texts = df["review_text"].dropna().tolist()
    topic_catalog = train_nmf_topic_model(review_texts, n_components=5, output_dir=ARTIFACTS_DIR)

    print("\n" + "=" * 60)
    print("TRAINING COMPLETE! SUMMARY OF FINDINGS:")
    print("=" * 60)
    champ = eval_results["champion"]
    print(f"Winner Model:     {champ['model_name']}")
    print(f"Test Accuracy:    {champ['test_metrics']['accuracy'] * 100:.2f}%")
    print(f"Test Macro F1:    {champ['test_metrics']['macro_f1']:.4f}")
    print(f"Inference Latency:{champ['test_metrics']['inference_latency_us']} microseconds/review")
    print(f"Confusion Matrix:\n{champ['test_metrics']['confusion_matrix']}")
    print("\nDiscovered NMF Topics:")
    for topic in topic_catalog:
        kws = ", ".join([k["word"] for k in topic["keywords"][:5]])
        print(f" - [{topic['topic_id']}] {topic['name']} -> ({kws})")
    print("=" * 60)


if __name__ == "__main__":
    main()

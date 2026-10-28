"""
Model Evaluation router exposing academic benchmark metrics, model comparison tournament,
confusion matrix, and transparent documentation of methodology and limitations.
"""

import os
import json
from fastapi import APIRouter, HTTPException, status

router = APIRouter(prefix="/api/model", tags=["model"])
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "artifacts")


@router.get("/evaluation")
def get_model_evaluation():
    """
    Returns full evaluation metrics comparing Logistic Regression vs Linear SVM,
    including confusion matrix, class distribution, and academic methodology.
    """
    eval_path = os.path.join(ARTIFACTS_DIR, "evaluation_metrics.json")
    if not os.path.exists(eval_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model evaluation artifacts not found. Please run train_models.py first."
        )

    try:
        with open(eval_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read evaluation metrics: {str(e)}"
        )

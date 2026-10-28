"""
AI synthesis endpoint for generating executive briefs and strategic recommendations.
"""

import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db_models import Dataset
from app.services.gemini_service import synthesize_executive_insights

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/synthesize/{dataset_id}")
def get_dataset_executive_synthesis(dataset_id: str, db: Session = Depends(get_db)):
    """
    Produces executive strategic synthesis for a completed dataset.
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found."
        )

    if not dataset.summary_stats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dataset analysis is not yet completed."
        )

    try:
        stats = json.loads(dataset.summary_stats)
        return synthesize_executive_insights(stats)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Synthesis failed: {str(e)}"
        )

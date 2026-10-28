"""
Topic Intelligence router exposing NMF topic clusters, keyword distributions,
sentiment breakdown per topic, and representative customer reviews.
"""

import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db_models import Dataset, Review
from app.models.schemas import TopicSummary

router = APIRouter(prefix="/api", tags=["topics"])


@router.get("/datasets/{dataset_id}/topics", response_model=List[TopicSummary])
def get_dataset_topics(dataset_id: str, db: Session = Depends(get_db)):
    """
    Returns discovered NMF topic summaries, keyword distributions, and sentiment breakdowns.
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
        data = json.loads(dataset.summary_stats)
        topics = data.get("topics", [])
        return [TopicSummary(**t) for t in topics]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load topics: {str(e)}"
        )

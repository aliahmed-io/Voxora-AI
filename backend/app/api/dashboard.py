"""
Overview Dashboard router providing aggregated sentiment KPIs, score gauge,
temporal trends, topic spikes, complaint drivers, and interactive sentiment map coordinates.
"""

import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db_models import Dataset
from app.models.schemas import DashboardStatsResponse

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.get("/datasets/{dataset_id}/dashboard", response_model=DashboardStatsResponse)
def get_dataset_dashboard(dataset_id: str, db: Session = Depends(get_db)):
    """
    Returns full analytical KPIs and aggregated metrics for a completed dataset.
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found."
        )

    if dataset.status != "completed" or not dataset.summary_stats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Dataset analysis is not complete (current status: {dataset.status})."
        )

    try:
        payload = json.loads(dataset.summary_stats)
        return DashboardStatsResponse(**payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse summary statistics: {str(e)}"
        )


@router.get("/dashboard/latest", response_model=DashboardStatsResponse)
def get_latest_dashboard(db: Session = Depends(get_db)):
    """
    Returns dashboard KPIs for the most recently completed dataset.
    """
    dataset = (
        db.query(Dataset)
        .filter(Dataset.status == "completed")
        .order_by(Dataset.created_at.desc())
        .first()
    )

    if not dataset or not dataset.summary_stats:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No completed datasets found. Please upload and analyze a dataset first."
        )

    payload = json.loads(dataset.summary_stats)
    return DashboardStatsResponse(**payload)

"""
Dataset management router for listing, querying, and deleting persistent datasets.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db_models import Dataset
from app.models.schemas import DatasetBrief

router = APIRouter(prefix="/api/datasets", tags=["datasets"])


@router.get("", response_model=List[DatasetBrief])
def list_datasets(db: Session = Depends(get_db)):
    """
    Returns list of all uploaded and analyzed datasets ordered newest first.
    """
    datasets = db.query(Dataset).order_by(Dataset.created_at.desc()).all()
    return [
        DatasetBrief(
            id=d.id,
            name=d.name,
            filename=d.filename,
            row_count=d.row_count,
            has_timestamps=d.has_timestamps,
            status=d.status,
            created_at=d.created_at.strftime("%Y-%m-%d %H:%M:%S UTC")
        )
        for d in datasets
    ]


@router.get("/{dataset_id}", response_model=DatasetBrief)
def get_dataset(dataset_id: str, db: Session = Depends(get_db)):
    """
    Retrieves dataset metadata by ID.
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found."
        )

    return DatasetBrief(
        id=dataset.id,
        name=dataset.name,
        filename=dataset.filename,
        row_count=dataset.row_count,
        has_timestamps=dataset.has_timestamps,
        status=dataset.status,
        created_at=dataset.created_at.strftime("%Y-%m-%d %H:%M:%S UTC")
    )


@router.delete("/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dataset(dataset_id: str, db: Session = Depends(get_db)):
    """
    Deletes dataset and cascades to all child reviews and jobs.
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found."
        )

    db.delete(dataset)
    db.commit()
    return None

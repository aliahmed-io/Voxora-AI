"""
Report generation router for downloading branded PDF intelligence summaries
and exporting full enriched review datasets as CSV.
"""

import os
import io
import json
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db_models import Dataset, Review
from app.services.report_generator import generate_pdf_report

router = APIRouter(prefix="/api/reports", tags=["reports"])
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "artifacts")


@router.get("/{dataset_id}/pdf")
def download_pdf_report(dataset_id: str, db: Session = Depends(get_db)):
    """
    Generates and streams an executive PDF report for a completed dataset.
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

    summary_stats = json.loads(dataset.summary_stats)

    # Load evaluation metrics if available
    eval_metrics = None
    eval_path = os.path.join(ARTIFACTS_DIR, "evaluation_metrics.json")
    if os.path.exists(eval_path):
        with open(eval_path, "r", encoding="utf-8") as f:
            eval_metrics = json.load(f)

    pdf_buffer = generate_pdf_report(dataset.name, summary_stats, eval_metrics)
    filename = f"Voxora_Report_{dataset.name.replace(' ', '_')}.pdf"

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.get("/{dataset_id}/csv")
def export_enriched_csv(dataset_id: str, db: Session = Depends(get_db)):
    """
    Exports all analyzed reviews for a dataset as a CSV file with predicted sentiment,
    confidence score, topic assignment, and polarity index.
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found."
        )

    reviews = db.query(Review).filter(Review.dataset_id == dataset_id).all()
    if not reviews:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No reviews found for this dataset."
        )

    records = []
    for r in reviews:
        records.append({
            "review_id": r.id,
            "review_text": r.original_text,
            "predicted_sentiment": r.predicted_sentiment,
            "confidence_score": round(r.confidence_score, 4),
            "polarity": round(r.polarity, 4),
            "topic_id": r.topic_id,
            "topic_name": r.topic_name,
            "review_date": r.review_date.strftime("%Y-%m-%d %H:%M:%S") if r.review_date else "",
            "original_rating": r.original_rating if r.original_rating is not None else ""
        })

    df = pd.DataFrame(records)
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)

    filename = f"Voxora_Enriched_{dataset.name.replace(' ', '_')}.csv"

    return StreamingResponse(
        io.BytesIO(csv_buffer.getvalue().encode("utf-8")),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

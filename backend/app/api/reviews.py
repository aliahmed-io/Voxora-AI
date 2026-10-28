"""
Review Explorer router providing searchable, filterable, and paginated review inspection
with token-level feature attribution and confidence metrics.
"""

import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.database import get_db
from app.models.db_models import Review, Dataset
from app.models.schemas import PaginatedReviewsResponse, ReviewDetail, InfluentialTerm

router = APIRouter(prefix="/api", tags=["reviews"])


@router.get("/datasets/{dataset_id}/reviews", response_model=PaginatedReviewsResponse)
def list_reviews(
    dataset_id: str,
    sentiment: Optional[str] = Query(None, description="positive | neutral | negative"),
    topic: Optional[str] = Query(None, description="Topic name filter"),
    search: Optional[str] = Query(None, description="Text search substring"),
    min_confidence: Optional[float] = Query(0.0, ge=0.0, le=1.0),
    sort_by: Optional[str] = Query("date", description="date | confidence | polarity"),
    sort_order: Optional[str] = Query("desc", description="asc | desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=5, le=100),
    db: Session = Depends(get_db)
):
    """
    Searchable, filterable, and paginated review explorer endpoint.
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found."
        )

    query = db.query(Review).filter(Review.dataset_id == dataset_id)

    if sentiment and sentiment.lower() in ["positive", "neutral", "negative"]:
        query = query.filter(Review.predicted_sentiment == sentiment.lower())

    if topic:
        query = query.filter(Review.topic_name == topic)

    if min_confidence and min_confidence > 0:
        query = query.filter(Review.confidence_score >= min_confidence)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(Review.original_text.ilike(term))

    # Sorting
    sort_column = Review.review_date
    if sort_by == "confidence":
        sort_column = Review.confidence_score
    elif sort_by == "polarity":
        sort_column = Review.polarity

    if sort_order == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    total = query.count()
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()

    results: List[ReviewDetail] = []
    for r in items:
        inf_terms = []
        if r.influential_terms:
            try:
                raw_terms = json.loads(r.influential_terms)
                inf_terms = [InfluentialTerm(**t) for t in raw_terms]
            except Exception:
                pass

        results.append(ReviewDetail(
            id=r.id,
            dataset_id=r.dataset_id,
            original_text=r.original_text,
            review_date=r.review_date.strftime("%Y-%m-%d %H:%M") if r.review_date else None,
            original_rating=r.original_rating,
            predicted_sentiment=r.predicted_sentiment,
            confidence_score=round(r.confidence_score, 4),
            polarity=round(r.polarity, 4),
            topic_id=r.topic_id,
            topic_name=r.topic_name,
            influential_terms=inf_terms
        ))

    total_pages = max(1, (total + page_size - 1) // page_size)

    return PaginatedReviewsResponse(
        items=results,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/reviews/{review_id}", response_model=ReviewDetail)
def get_review_detail(review_id: str, db: Session = Depends(get_db)):
    """
    Returns single review with full token explainability payload.
    """
    r = db.query(Review).filter(Review.id == review_id).first()
    if not r:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found."
        )

    inf_terms = []
    if r.influential_terms:
        try:
            raw_terms = json.loads(r.influential_terms)
            inf_terms = [InfluentialTerm(**t) for t in raw_terms]
        except Exception:
            pass

    return ReviewDetail(
        id=r.id,
        dataset_id=r.dataset_id,
        original_text=r.original_text,
        review_date=r.review_date.strftime("%Y-%m-%d %H:%M") if r.review_date else None,
        original_rating=r.original_rating,
        predicted_sentiment=r.predicted_sentiment,
        confidence_score=round(r.confidence_score, 4),
        polarity=round(r.polarity, 4),
        topic_id=r.topic_id,
        topic_name=r.topic_name,
        influential_terms=inf_terms
    )

"""
SQLAlchemy ORM models representing persistent datasets, reviews, topics, and analysis jobs.
"""

from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    Text,
    ForeignKey,
    Index
)
from sqlalchemy.orm import relationship
from app.database import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    filename = Column(String(255), nullable=False)
    row_count = Column(Integer, default=0, nullable=False)
    has_timestamps = Column(Boolean, default=False, nullable=False)
    status = Column(String(32), default="uploaded", nullable=False)  # uploaded, analyzing, completed, failed
    summary_stats = Column(Text, nullable=True)  # JSON-encoded statistics summary
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    reviews = relationship("Review", back_populates="dataset", cascade="all, delete-orphan")
    jobs = relationship("AnalysisJob", back_populates="dataset", cascade="all, delete-orphan")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(36), primary_key=True, index=True)
    dataset_id = Column(String(36), ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    original_text = Column(Text, nullable=False)
    clean_text = Column(Text, nullable=False)
    review_date = Column(DateTime, nullable=True, index=True)
    original_rating = Column(Float, nullable=True)
    
    # Model inferences
    predicted_sentiment = Column(String(16), nullable=False, index=True)  # positive, neutral, negative
    confidence_score = Column(Float, nullable=False)
    polarity = Column(Float, nullable=False)  # -1.0 (most negative) to +1.0 (most positive)
    topic_id = Column(Integer, nullable=False, index=True)
    topic_name = Column(String(128), nullable=False)
    influential_terms = Column(Text, nullable=True)  # JSON-encoded token attributions

    dataset = relationship("Dataset", back_populates="reviews")

    __table_args__ = (
        Index("ix_reviews_dataset_sentiment", "dataset_id", "predicted_sentiment"),
        Index("ix_reviews_dataset_topic", "dataset_id", "topic_id"),
    )


class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"

    id = Column(String(36), primary_key=True, index=True)
    dataset_id = Column(String(36), ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    progress = Column(Float, default=0.0, nullable=False)  # 0.0 to 100.0
    status = Column(String(32), default="pending", nullable=False)  # pending, processing, completed, failed
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    dataset = relationship("Dataset", back_populates="jobs")

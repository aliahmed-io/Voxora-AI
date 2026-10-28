"""
Pydantic schema definitions ensuring strict type validation and explicit API contracts.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class UploadPreviewResponse(BaseModel):
    file_id: str
    filename: str
    total_rows: int
    detected_columns: List[str]
    suggested_mapping: Dict[str, Optional[str]]
    preview_rows: List[Dict[str, Any]]


class StartAnalysisRequest(BaseModel):
    file_id: str
    dataset_name: str = Field(..., min_length=1, max_length=128)
    text_column: str = Field(..., min_length=1)
    date_column: Optional[str] = None
    rating_column: Optional[str] = None
    category_column: Optional[str] = None


class JobStatusResponse(BaseModel):
    job_id: str
    dataset_id: str
    status: str
    progress: float
    error_message: Optional[str] = None


class DatasetBrief(BaseModel):
    id: str
    name: str
    filename: str
    row_count: int
    has_timestamps: bool
    status: str
    created_at: str


class InfluentialTerm(BaseModel):
    term: str
    weight: float
    magnitude: float
    polarity: str


class ReviewDetail(BaseModel):
    id: str
    dataset_id: str
    original_text: str
    review_date: Optional[str] = None
    original_rating: Optional[float] = None
    predicted_sentiment: str
    confidence_score: float
    polarity: float
    topic_id: int
    topic_name: str
    influential_terms: List[InfluentialTerm] = []


class PaginatedReviewsResponse(BaseModel):
    items: List[ReviewDetail]
    total: int
    page: int
    page_size: int
    total_pages: int


class SentimentTrendPoint(BaseModel):
    date: str
    average_score: float
    positive_count: int
    neutral_count: int
    negative_count: int
    total_count: int


class SentimentMapPoint(BaseModel):
    id: str
    x: float  # mention length or intensity
    y: float  # polarity score (-100 to +100)
    sentiment: str
    topic: str
    preview: str


class TopicSummary(BaseModel):
    topic_id: int
    name: str
    review_count: int
    percentage: float
    sentiment_distribution: Dict[str, int]
    top_keywords: List[str]
    representative_reviews: List[str]


class DashboardStatsResponse(BaseModel):
    dataset_id: str
    dataset_name: str
    total_reviews: int
    sentiment_score: int  # 0 to 100
    distribution: Dict[str, int]
    percentages: Dict[str, float]
    topics: List[TopicSummary]
    top_complaints: List[Dict[str, Any]]
    highlights: List[Dict[str, Any]]
    trend: List[SentimentTrendPoint]
    sentiment_map: List[SentimentMapPoint]
    channels: List[Dict[str, Any]]

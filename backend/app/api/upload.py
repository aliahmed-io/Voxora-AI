"""
Upload endpoints for CSV file ingestion, schema detection, and sample dataset pre-loading.
"""

import os
import uuid
import shutil
import pandas as pd
from typing import Dict, Any, List
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.models.schemas import UploadPreviewResponse

router = APIRouter(prefix="/api", tags=["upload"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "uploads")
SAMPLE_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "sample_data"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_UPLOAD_BYTES = 25 * 1024 * 1024  # 25 MB max


def auto_detect_columns(columns: List[str]) -> Dict[str, str | None]:
    """Smart heuristic mapping for column names."""
    col_map: Dict[str, str | None] = {
        "text_column": None,
        "date_column": None,
        "rating_column": None,
        "category_column": None
    }
    
    col_lower = {c.lower(): c for c in columns}
    
    # Text detection
    for key in ["review_text", "text", "review", "content", "comment", "feedback", "body", "message"]:
        if key in col_lower:
            col_map["text_column"] = col_lower[key]
            break
            
    # Date detection
    for key in ["timestamp", "date", "created_at", "review_date", "time", "datetime"]:
        if key in col_lower:
            col_map["date_column"] = col_lower[key]
            break
            
    # Rating detection
    for key in ["rating", "score", "stars", "star_rating"]:
        if key in col_lower:
            col_map["rating_column"] = col_lower[key]
            break
            
    # Category detection
    for key in ["topic_category", "category", "topic", "channel", "department"]:
        if key in col_lower:
            col_map["category_column"] = col_lower[key]
            break
            
    # Fallback for text: first string column if not found
    if not col_map["text_column"] and len(columns) > 0:
        col_map["text_column"] = columns[0]
        
    return col_map


@router.post("/upload", response_model=UploadPreviewResponse)
async def upload_csv_file(file: UploadFile = File(...)):
    """
    Accepts CSV upload, validates mime and size, parses headers, and returns row preview.
    """
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Please upload a standard comma-separated (.csv) file."
        )

    file_id = str(uuid.uuid4())
    temp_file_path = os.path.join(UPLOAD_DIR, f"{file_id}.csv")

    bytes_read = 0
    with open(temp_file_path, "wb") as f_out:
        while chunk := await file.read(1024 * 1024):  # 1MB chunks
            bytes_read += len(chunk)
            if bytes_read > MAX_UPLOAD_BYTES:
                f_out.close()
                if os.path.exists(temp_file_path):
                    os.remove(temp_file_path)
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"Uploaded file exceeds maximum limit of {MAX_UPLOAD_BYTES // (1024 * 1024)}MB."
                )
            f_out.write(chunk)

    try:
        df = pd.read_csv(temp_file_path, nrows=50)
        total_rows = sum(1 for _ in open(temp_file_path, "r", encoding="utf-8", errors="ignore")) - 1
        if total_rows < 1:
            raise ValueError("CSV file contains no data rows.")
    except Exception as e:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse CSV file: {str(e)}"
        )

    detected_cols = df.columns.tolist()
    suggested = auto_detect_columns(detected_cols)

    # Convert preview rows to JSON-safe dictionaries
    preview_df = df.head(5).fillna("")
    preview_records = preview_df.to_dict(orient="records")

    return UploadPreviewResponse(
        file_id=file_id,
        filename=file.filename,
        total_rows=max(total_rows, len(df)),
        detected_columns=detected_cols,
        suggested_mapping=suggested,
        preview_rows=preview_records
    )


@router.post("/load-sample/{sample_type}", response_model=UploadPreviewResponse)
def load_sample_dataset(sample_type: str):
    """
    Loads pre-packaged benchmark dataset samples for instant 1-click evaluation.
    sample_type: 'saas' | 'ecommerce' | 'raw'
    """
    sample_files = {
        "saas": "voxora_saas_feedback.csv",
        "ecommerce": "ecommerce_customer_reviews.csv",
        "raw": "raw_customer_feedback_upload.csv"
    }

    if sample_type not in sample_files:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unknown sample type. Options: {list(sample_files.keys())}"
        )

    src_filename = sample_files[sample_type]
    src_path = os.path.join(SAMPLE_DATA_DIR, src_filename)

    if not os.path.exists(src_path):
        # Fallback path if run from backend directory
        alt_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "sample_data", src_filename)
        if os.path.exists(alt_path):
            src_path = alt_path
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Sample data file not found on disk."
            )

    file_id = f"sample_{sample_type}_{uuid.uuid4().hex[:8]}"
    dst_path = os.path.join(UPLOAD_DIR, f"{file_id}.csv")
    shutil.copyfile(src_path, dst_path)

    df = pd.read_csv(dst_path)
    total_rows = len(df)
    detected_cols = df.columns.tolist()
    suggested = auto_detect_columns(detected_cols)
    preview_records = df.head(5).fillna("").to_dict(orient="records")

    return UploadPreviewResponse(
        file_id=file_id,
        filename=src_filename,
        total_rows=total_rows,
        detected_columns=detected_cols,
        suggested_mapping=suggested,
        preview_rows=preview_records
    )

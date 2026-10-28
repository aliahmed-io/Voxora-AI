"""
Database seeding script that analyzes the benchmark sample dataset
so Voxora AI has immediate, rich analytical results on first boot.
"""

import os
import sys

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.database import engine, Base, SessionLocal
from app.models.db_models import Dataset, Review, AnalysisJob
from app.api.analysis import run_analysis_pipeline

SAMPLE_FILE = os.path.abspath(os.path.join(backend_dir, "..", "sample_data", "voxora_saas_feedback.csv"))


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if any dataset already exists with completed row count
    existing = db.query(Dataset).first()
    if existing and existing.row_count > 0:
        print(f"Database already seeded with dataset: {existing.name} (id: {existing.id}, rows: {existing.row_count})")
        db.close()
        return

    # Clean up incomplete seeding if present
    if existing:
        print(f"Cleaning up incomplete dataset {existing.id}...")
        db.query(Review).filter(Review.dataset_id == existing.id).delete()
        db.query(AnalysisJob).filter(AnalysisJob.dataset_id == existing.id).delete()
        db.query(Dataset).filter(Dataset.id == existing.id).delete()
        db.commit()

    print("Seeding database with Voxora SaaS Feedback dataset...")
    dataset_id = "seed-voxora-saas-2026"
    job_id = "seed-job-001"

    new_dataset = Dataset(
        id=dataset_id,
        name="Voxora Enterprise SaaS Feedback",
        filename="voxora_saas_feedback.csv",
        row_count=0,
        status="analyzing"
    )
    db.add(new_dataset)

    new_job = AnalysisJob(
        id=job_id,
        dataset_id=dataset_id,
        status="pending",
        progress=0.0
    )
    db.add(new_job)

    db.commit()
    db.close()

    req_data = {
        "text_column": "review_text",
        "date_column": "timestamp",
        "rating_column": "rating",
        "category_column": "topic_category"
    }

    run_analysis_pipeline(job_id, dataset_id, SAMPLE_FILE, req_data)
    print("Database seeding completed successfully!")


if __name__ == "__main__":
    seed()

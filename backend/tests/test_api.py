"""
API Integration tests using FastAPI TestClient.
Tests health, sample loading, model evaluation, and reporting.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_model_evaluation_endpoint():
    response = client.get("/api/model/evaluation")
    assert response.status_code == 200
    data = response.json()
    assert "champion" in data
    assert "comparison" in data
    assert "confusion_matrix" in data["champion"]["test_metrics"]
    assert "accuracy" in data["champion"]["test_metrics"]


def test_load_sample_dataset():
    response = client.post("/api/load-sample/saas")
    assert response.status_code == 200
    data = response.json()
    assert "file_id" in data
    assert data["total_rows"] > 0
    assert "review_text" in data["detected_columns"]
    assert data["suggested_mapping"]["text_column"] == "review_text"

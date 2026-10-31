"""
Voxora AI — FastAPI Main Application Entry Point.
Initializes database schema, registers API routers, and configures CORS middleware.
"""

import os
import sys
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import upload, analysis, datasets, dashboard, reviews, topics, model_eval, reports, ai_insights


def get_current_port() -> int:
    """Extract configured port from environment or CLI arguments with 8002 fallback."""
    if "PORT" in os.environ:
        try:
            return int(os.environ["PORT"])
        except ValueError:
            pass
    for i, arg in enumerate(sys.argv):
        if arg in ("--port", "-p") and i + 1 < len(sys.argv):
            try:
                return int(sys.argv[i + 1])
            except ValueError:
                pass
        elif arg.startswith("--port="):
            try:
                return int(arg.split("=", 1)[1])
            except ValueError:
                pass
    return 8002


def record_port_metadata(port: int):
    """Write backend port to public directory so frontend can auto-discover."""
    payload = json.dumps(
        {
            "port": port,
            "url": f"http://127.0.0.1:{port}",
            "service": "Voxora AI API",
        },
        indent=2,
    )
    target_paths = [
        os.path.join(os.path.dirname(__file__), "..", "..", "backend_port.json"),
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "frontend",
            "public",
            "backend_port.json",
        ),
    ]
    for target in target_paths:
        try:
            target_abs = os.path.abspath(target)
            os.makedirs(os.path.dirname(target_abs), exist_ok=True)
            with open(target_abs, "w", encoding="utf-8") as f:
                f.write(payload)
        except Exception as e:
            print(f"Notice: Could not write port metadata to {target}: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    Base.metadata.create_all(bind=engine)
    port = get_current_port()
    record_port_metadata(port)
    print(f"Voxora AI Backend active on http://127.0.0.1:{port}")
    yield


app = FastAPI(
    title="Voxora AI API",
    description="Customer Feedback Intelligence & Sentiment Analytics Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for Next.js frontend communication on any local port
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3004",
        "http://127.0.0.1:3004",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(upload.router)
app.include_router(analysis.router)
app.include_router(datasets.router)
app.include_router(dashboard.router)
app.include_router(reviews.router)
app.include_router(topics.router)
app.include_router(model_eval.router)
app.include_router(reports.router)
app.include_router(ai_insights.router)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Voxora AI API",
        "version": "1.0.0",
        "port": get_current_port(),
    }

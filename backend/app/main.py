"""
Voxora AI — FastAPI Main Application Entry Point.
Initializes database schema, registers API routers, and configures CORS middleware.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import upload, analysis, datasets, dashboard, reviews, topics, model_eval, reports, ai_insights


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    Base.metadata.create_all(bind=engine)
    print("Voxora AI Database initialized.")
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
        "version": "1.0.0"
    }

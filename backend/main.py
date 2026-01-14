"""
The Knowledge Extractor - FastAPI Backend
A local-first study aid that extracts text from PDFs and generates
flashcards and quizzes using Gemini AI.

This file handles app initialization and middleware configuration.
Routes are defined in routes.py, models in responses.py.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import health_router, router

# Initialize FastAPI app
app = FastAPI(
    title="The Knowledge Extractor",
    description="Extract knowledge from PDFs and generate study materials",
    version="1.0.0",
)

# Configure CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router)
app.include_router(router)

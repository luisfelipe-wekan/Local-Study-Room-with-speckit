"""
The Knowledge Extractor - FastAPI Backend
A local-first study aid that extracts text from PDFs and generates
flashcards and quizzes using Gemini AI.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/health")
async def health_check():
    """Health check endpoint to verify the server is running."""
    return {"status": "healthy", "service": "knowledge-extractor"}

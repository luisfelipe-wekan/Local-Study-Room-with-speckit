"""
API route handlers for The Knowledge Extractor.
"""

from typing import List

from fastapi import APIRouter, HTTPException

from responses import FileInfo, Flashcard, QuizQuestion, QuizSubmission, GradedAnswer
from tools import get_pdf_files

# Create router instances
router = APIRouter(prefix="/api", tags=["api"])
health_router = APIRouter(tags=["health"])


@health_router.get("/health")
async def health_check():
    """Health check endpoint to verify the server is running."""
    return {"status": "healthy", "service": "knowledge-extractor"}


@router.get("/files", response_model=List[FileInfo])
async def get_files():
    """Get list of PDF files in the documents folder."""
    pdf_files = get_pdf_files()
    return [FileInfo(name=name, size=size) for name, size in pdf_files]


@router.get("/flashcards", response_model=List[Flashcard])
async def get_flashcards():
    """Generate flashcards from PDF content using Gemini AI."""
    # Stub - will be fully implemented in T023-T024
    raise HTTPException(
        status_code=501,
        detail="Flashcard generation not yet implemented. Coming in Phase 4.",
    )


@router.get("/quiz", response_model=List[QuizQuestion])
async def get_quiz():
    """Generate quiz questions from PDF content using Gemini AI."""
    # Stub - will be fully implemented in T031-T032
    raise HTTPException(
        status_code=501,
        detail="Quiz generation not yet implemented. Coming in Phase 5.",
    )


@router.post("/quiz/grade", response_model=List[GradedAnswer])
async def grade_quiz(submission: QuizSubmission):
    """Grade submitted quiz answers using Gemini AI."""
    # Stub - will be fully implemented in T033-T034
    raise HTTPException(
        status_code=501, detail="Quiz grading not yet implemented. Coming in Phase 5."
    )

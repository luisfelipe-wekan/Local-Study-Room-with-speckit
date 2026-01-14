"""
API route handlers for The Knowledge Extractor.
"""

from typing import List

from fastapi import APIRouter, HTTPException

from responses import FileInfo, Flashcard, QuizQuestion, QuizSubmission, GradedAnswer
from tools import (
    get_pdf_files,
    scan_all_pdfs,
    generate_flashcards_with_gemini,
    generate_quiz_with_gemini,
    grade_quiz_with_gemini,
)

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
    # Get combined text from all PDFs
    text = scan_all_pdfs()

    if not text:
        raise HTTPException(
            status_code=404,
            detail="No PDF documents found. Add PDFs to the ./documents folder.",
        )

    try:
        flashcards_data = await generate_flashcards_with_gemini(text)
        return [Flashcard(front=fc["front"], back=fc["back"]) for fc in flashcards_data]
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate flashcards: {str(e)}",
        )


@router.get("/quiz", response_model=List[QuizQuestion])
async def get_quiz():
    """Generate quiz questions from PDF content using Gemini AI."""
    # Get combined text from all PDFs
    text = scan_all_pdfs()

    if not text:
        raise HTTPException(
            status_code=404,
            detail="No PDF documents found. Add PDFs to the ./documents folder.",
        )

    try:
        quiz_data = await generate_quiz_with_gemini(text)
        return [
            QuizQuestion(
                question=q["question"],
                options=q["options"],
                correct_index=q["correct_index"],
            )
            for q in quiz_data
        ]
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate quiz: {str(e)}",
        )


@router.post("/quiz/grade", response_model=List[GradedAnswer])
async def grade_quiz(submission: QuizSubmission):
    """Grade submitted quiz answers using Gemini AI."""
    if not submission.answers:
        raise HTTPException(status_code=400, detail="No answers provided.")

    # Convert Pydantic models to dicts for the grading function
    answers_data = [
        {
            "question_index": ans.question_index,
            "selected_index": ans.selected_index,
            "question": ans.question,
            "options": ans.options,
            "correct_index": ans.correct_index,
        }
        for ans in submission.answers
    ]

    try:
        graded_data = await grade_quiz_with_gemini(answers_data)
        return [
            GradedAnswer(
                question_index=g["question_index"],
                is_correct=g["is_correct"],
                feedback=g["feedback"],
            )
            for g in graded_data
        ]
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to grade quiz: {str(e)}",
        )

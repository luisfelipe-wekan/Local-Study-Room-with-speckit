"""
Pydantic models for API request/response validation.
"""

from typing import List

from pydantic import BaseModel


class FileInfo(BaseModel):
    """PDF file metadata."""

    name: str
    size: int


class Flashcard(BaseModel):
    """A single flashcard with front and back."""

    front: str
    back: str


class QuizQuestion(BaseModel):
    """A quiz question with multiple choice options."""

    question: str
    options: List[str]
    correct_index: int


class QuizAnswer(BaseModel):
    """A submitted quiz answer."""

    question_index: int
    selected_index: int
    question: str
    options: List[str]
    correct_index: int


class QuizSubmission(BaseModel):
    """Quiz submission payload."""

    answers: List[QuizAnswer]


class GradedAnswer(BaseModel):
    """Graded answer with feedback."""

    question_index: int
    is_correct: bool
    feedback: str

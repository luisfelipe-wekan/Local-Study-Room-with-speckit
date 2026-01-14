# Specification: The Knowledge Extractor

**Version:** 1.0.0  
**Created:** 2026-01-10  
**Status:** Draft

---

## Overview

"The Knowledge Extractor" is a local-first study aid that transforms PDF documents into interactive learning materials. Users place PDF files in a `./documents` folder, and the application uses Gemini 3 to generate flashcards and quizzes based on the extracted text content.

---

## Core Features

### 1. Document Detection
- Scan the local `./documents` folder for PDF files
- Display a list of detected files with metadata (name, size)
- Extract text content from all PDFs (images are discarded)
- Combine text from multiple PDFs into a single corpus for generation

### 2. Study Mode (Flashcards)
- Generate 10 flashcards from the combined PDF content using Gemini 3
- Each flashcard has a **front** (question/term) and **back** (answer/definition)
- User can flip through cards one at a time
- Card flip animation for revealing the answer
- Navigation controls: Previous, Next, Flip

### 3. Quiz Mode
- Generate a 10-question multiple-choice quiz using Gemini 3
- Each question has 4 options and one correct answer
- User selects answers and submits the quiz
- Grading with score calculation (correct/total, percentage)
- AI-generated feedback for each answer explaining why it's correct or incorrect

---

## Technical Requirements

### Frontend (React + Vite)
- Single-page application with three views: Home, Study Mode, Quiz Mode
- Use Tailwind CSS for styling (per constitution)
- Use Lucide React for icons (per constitution)
- State management via `useState` and `useContext` only (no Redux)
- Functional components with hooks only (no class components)

### Backend (FastAPI)
- Python 3.10+ with FastAPI framework
- Pydantic v2 for request/response validation
- Async/await for all Gemini API calls
- Load API key from `.env` file

**Architecture (Separation of Concerns):**
- `main.py` — App initialization, middleware, router inclusion only
- `routes.py` — All API endpoint handlers (using FastAPI's APIRouter)
- `responses.py` — Pydantic models for request/response validation
- `tools.py` — Utility functions (PDF extraction, Gemini client, JSON parsing)

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check to verify server is running |
| GET | `/api/files` | List all PDFs in the documents folder |
| GET | `/api/flashcards` | Generate 10 flashcards from PDF content |
| GET | `/api/quiz` | Generate 10-question quiz from PDF content |
| POST | `/api/quiz/grade` | Grade submitted answers with AI feedback |

### PDF Processing
- Use PyMuPDF (fitz) for text extraction
- Extract text only; ignore images, charts, and non-text elements
- Combine all PDFs into a single text corpus before sending to Gemini

### AI Integration (Gemini 3 Flash)
- Use `google-generativeai` SDK
- Structured JSON output for flashcards and quiz questions
- Graceful error handling if API fails

---

## User Flows

### Flow 1: View Documents
1. User opens the application
2. App displays list of PDFs found in `./documents`
3. User sees file names and sizes

### Flow 2: Study with Flashcards
1. User clicks "Study Mode"
2. App calls `/api/flashcards` to generate cards
3. Loading state while Gemini processes
4. First flashcard displayed (front side)
5. User clicks to flip and see answer
6. User navigates through all 10 cards

### Flow 3: Take a Quiz
1. User clicks "Quiz Mode"
2. App calls `/api/quiz` to generate questions
3. Loading state while Gemini processes
4. Quiz displayed with all 10 questions
5. User selects answers for each question
6. User clicks "Submit Quiz"
7. App calls `/api/quiz/grade` with answers
8. Results displayed: score + per-question feedback

---

## Data Structures

### Flashcard
```json
{
  "front": "What is photosynthesis?",
  "back": "The process by which plants convert sunlight into energy."
}
```

### Quiz Question
```json
{
  "question": "What is the primary function of mitochondria?",
  "options": ["Energy production", "Protein synthesis", "Cell division", "Waste removal"],
  "correct_answer": "Energy production",
  "explanation": "Mitochondria are known as the powerhouse of the cell..."
}
```

### Quiz Submission
```json
{
  "answers": [
    { "question_index": 0, "answer": "Energy production" },
    { "question_index": 1, "answer": "..." }
  ],
  "questions": [/* original questions for grading context */]
}
```

---

## Constraints & Non-Goals

Per the project constitution:
- ❌ No database (in-memory or local JSON only)
- ❌ No user authentication
- ❌ No caching of old quizzes or flashcards
- ❌ No image extraction from PDFs
- ❌ No Redux for state management
- ❌ No class components

---

## File Structure

```
studyroom4/
├── documents/           # User places PDFs here
├── backend/
│   ├── main.py          # App initialization, middleware, router inclusion
│   ├── routes.py        # API endpoint handlers
│   ├── responses.py     # Pydantic models for validation
│   ├── tools.py         # Utility functions (PDF, Gemini, parsing)
│   ├── requirements.txt
│   └── .env             # GEMINI_API_KEY
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Main shell + view routing
│   │   ├── main.jsx     # React entry point
│   │   ├── api.js       # API utility functions
│   │   ├── components/
│   │   │   ├── FileList.jsx
│   │   │   ├── Flashcard.jsx
│   │   │   └── Quiz.jsx
│   │   └── index.css    # Tailwind imports + custom styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── spec.md              # What to build
├── plan.md              # How to build it
└── tasks.md             # Task checklist
```

---

## Success Criteria

- [ ] PDFs in `./documents` are detected and listed
- [ ] Clicking "Study Mode" generates and displays 10 flashcards
- [ ] Flashcards can be flipped and navigated
- [ ] Clicking "Quiz Mode" generates and displays 10 questions
- [ ] Quiz can be submitted and graded
- [ ] Each answer receives AI-generated feedback
- [ ] Application works entirely locally (except Gemini API calls)


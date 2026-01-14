# Implementation Plan: The Knowledge Extractor

**Based on:** spec.md v1.0.0  
**Created:** 2026-01-10

---

## Approach Overview

I will build this as a two-tier local application: a FastAPI backend that handles all PDF processing and AI generation, and a React frontend that provides the interactive study interface. The backend will be stateless (no database), regenerating content fresh on each request as specified.

---

## Backend Implementation

### PDF Text Extraction

I'll use **PyMuPDF** (`fitz`) because it's fast, pure-Python compatible, and excellent at extracting raw text while ignoring images. For each PDF in the `./documents` folder:

1. Open the file with `fitz.open()`
2. Iterate through pages calling `page.get_text("text")` 
3. Concatenate all text into a single string

When multiple PDFs exist, I'll combine them with clear separators so Gemini understands the content boundaries, but treats it as one unified knowledge base.

### Gemini Integration

I'll use the `google-generativeai` SDK with the **Gemini 2.0 Flash** model (the current Gemini 3 equivalent). The key challenge is getting structured JSON output reliably. My approach:

1. **Explicit JSON prompts** — Tell Gemini to return "ONLY a valid JSON array" with exact structure examples
2. **Response parsing** — Extract JSON from markdown code blocks if Gemini wraps it, then fall back to raw parsing
3. **Truncation** — Limit input text to ~15,000 characters to stay within token limits while capturing key content

For quiz grading, I'll send each answer individually to get personalized feedback rather than batch grading, ensuring quality explanations.

### API Design

Four endpoints, all async:

- `GET /api/files` — Scans `./documents`, returns file metadata (no AI needed)
- `GET /api/flashcards` — Extracts all PDFs, calls Gemini, returns 10 cards
- `GET /api/quiz` — Same extraction, different Gemini prompt for quiz format
- `POST /api/quiz/grade` — Receives answers + original questions, grades each with AI feedback

I'll add CORS middleware allowing all origins since this is local-only.

---

## Frontend Implementation

### Architecture

A single `App.jsx` component will manage the view state (home/study/quiz) using `useState`. No router needed for this single-page app. Each mode gets its own component:

- `FileList.jsx` — Displays detected PDFs
- `Flashcard.jsx` — The flip-through study experience  
- `Quiz.jsx` — Question display, answer selection, results

### Styling Approach

Per the constitution, I'll use **Tailwind CSS** exclusively. I'm planning a dark, scholarly aesthetic:

- Deep charcoal background with warm amber accents
- Serif font (Crimson Pro) for content, monospace for UI elements
- Subtle paper-like textures for cards

### Flashcard Interaction

The flip animation will use CSS 3D transforms (`rotateY`) with `transform-style: preserve-3d`. The card container maintains state for:
- Current card index
- Whether the card is flipped
- The array of flashcard data

Navigation will be simple Previous/Next buttons with keyboard arrow support.

### Quiz Flow

The quiz will display all 10 questions at once (scrollable list) rather than one-at-a-time, letting users review before submitting. State tracking:

- `answers` object mapping question index → selected option
- `submitted` boolean to lock in answers
- `results` array from the grading API

After submission, each question shows a colored indicator (green/red) and the AI feedback inline.

---

## File Organization

```
backend/
├── main.py          # FastAPI app initialization and CORS config
├── routes.py        # API route handlers
├── responses.py     # Pydantic models for request/response validation
├── tools.py         # Utility functions (PDF extraction, Gemini helpers)
├── requirements.txt
└── .env             # API key

frontend/
├── src/
│   ├── App.jsx      # Main shell + view routing
│   ├── api.js       # API utility functions
│   ├── components/  # FileList, Flashcard, Quiz
│   └── index.css    # Tailwind imports + custom styles
├── index.html
└── vite.config.js   # Proxy /api to backend
```

Backend is split into four files for clean separation of concerns:
- `main.py` — App initialization, middleware, router inclusion
- `routes.py` — API endpoint handlers
- `responses.py` — Pydantic models for validation
- `tools.py` — Reusable utilities (PDF extraction, Gemini client, JSON parsing)

---

## Error Handling Strategy

- **No PDFs found** — Return friendly message, frontend shows empty state with instructions
- **PDF extraction fails** — Skip that file, continue with others, log error
- **Gemini API fails** — Return mock/error data so the UI doesn't break, show error message
- **Invalid API key** — Detect on startup, return helpful error in responses

---

## What I Won't Do

Per spec constraints:
- No caching — Every flashcard/quiz request regenerates fresh content
- No image extraction — Only `get_text("text")` calls, images are ignored
- No database — All data is ephemeral, computed on demand
- No authentication — Open access, local use only

---

## Ready to Build

This plan covers the architectural decisions and implementation approach. The actual code will follow the patterns described above, with the backend handling all AI complexity and the frontend providing a clean, focused study experience.


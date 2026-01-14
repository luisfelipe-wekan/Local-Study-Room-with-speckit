# The Knowledge Extractor

> A local-first study aid built entirely with **Spec-Kit** — an AI-assisted specification-driven development workflow.

## About This Project

This project demonstrates how to build a complete application using Spec-Kit commands in Cursor IDE. The entire development process—from specification to implementation—is guided by structured commands that ensure consistency, traceability, and clean git history.

**What it does:**
- Scans a local `./documents` folder for PDF files
- Extracts text and generates 10 flashcards using Gemini AI
- Creates 10-question quizzes with AI-powered grading and feedback
- Provides Study Mode (flashcards) and Quiz Mode interfaces

## The Constitution

All architectural decisions, tech stack choices, and constraints are defined in the **Constitution** file:

```
.specify/memory/constitution.md
```

This document is the authoritative guide that Cursor must follow. It defines:
- **Tech Stack:** React + Vite + Tailwind (frontend), FastAPI + Python (backend)
- **Constraints:** No databases, no authentication, no Redux, hooks only
- **Principles:** Local-first, simplicity over scale, async AI calls

**Before starting any implementation, the AI reads the constitution to understand what it can and cannot do.**

---

## Spec-Kit Commands

Spec-Kit provides a structured workflow through custom Cursor commands located in `.cursor/commands/`:

### 1. `/speckit.specify` — Create Specification
Generates a `spec.md` file that documents **what** to build:
- Features and requirements
- User flows
- Data structures
- API endpoints
- Success criteria

```
/speckit.specify "Build a local study aid called 'The Knowledge Extractor'. It is a single-page React app with a FastAPI backend. The backend must scan a local './documents' folder for PDFs, extract their text, and use Gemini 3 to generate 10 flashcards and a 10-question quiz based on the content. The Frontend should have a list of detected files, a 'Study Mode' to flip through flashcards, and a 'Quiz Mode' that grades answers and provides AI feedback. Focus only on the text on the pdf, if there are images for now just discard them. If multiple pdfs, just read them all together. For now, no cache memory to save old quizzes."
```

### 2. `/speckit.plan` — Create Implementation Plan
Generates a `plan.md` file that documents **how** to build it:
- Technical approach
- Architecture decisions
- File organization
- Error handling strategy

```
/speckit.plan
```

### 3. `/speckit.tasks` — Generate Task List
Generates a `tasks.md` file with actionable, dependency-ordered tasks:
- Organized by user stories (US1, US2, US3...)
- Each task has ID, parallel marker [P], and file path
- Phases: Setup → Foundational → User Stories → Polish

```
/speckit.tasks
```

### 4. `/speckit.implement` — Execute Tasks
Executes tasks from `tasks.md` phase by phase:
- Marks completed tasks as `[X]`
- Validates against specification
- Reports progress

```
/speckit.implement
```

### 5. Other Commands
| Command | Purpose |
|---------|---------|
| `/speckit.constitution` | Create or update the constitution |
| `/speckit.analyze` | Analyze project for consistency |
| `/speckit.checklist` | Generate review checklists |
| `/speckit.clarify` | Ask clarifying questions about spec |
| `/speckit.taskstoissues` | Convert tasks to GitHub issues |

---

## Prompting for Commits

**Important:** The default `/speckit.implement` command does NOT automatically create git commits. You must explicitly instruct Cursor to commit after each task.

### Recommended Prompt

When running implementation, add this instruction:

```
/speckit.implement

After each task, make a git commit with the message format:
"implement T001 - <description of what happened in that task>"
```

### Example Session

```
User: /speckit.implement for T001 only, commit after completion

Cursor: 
1. Creates documents/README.md
2. Marks T001 as [X] in tasks.md
3. Runs: git add ... && git commit -m "implement T001 - Create documents folder with placeholder README"
```

### For Multiple Tasks

```
User: Execute Phase 1 (T001-T008), commit after EACH task

Cursor:
- T001 → commit
- T002 → commit
- T003 → commit
- ... and so on
```

This creates a clean, traceable git history where each task is a single commit.

---

## Project Structure

```
studyroom4/
├── .cursor/
│   └── commands/           # Spec-Kit command definitions
├── .specify/
│   └── memory/
│       └── constitution.md # Project constitution
├── documents/              # Place PDFs here
├── backend/
│   ├── main.py             # FastAPI server
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── spec.md                 # What to build
├── plan.md                 # How to build it
├── tasks.md                # Task checklist
└── README.md               # This file
```

---

## Phase 1 Checkpoint: Foundation & Environment

Once the implementation of the first phase (Tasks T001-T010) is complete, perform these checks to ensure the workspace is ready for AI feature development.

### 1. Git History Audit

Verify that the implementation agent has maintained a clean, traceable history.

```bash
git log --oneline
```

**Success Criteria:** You should see a sequential list of 10 commits (T001 through T010).

### 2. Backend Health Check

Ensure the Python environment and FastAPI skeleton are functional.

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Success Criteria:** Visit http://127.0.0.1:8000/docs. The Swagger UI should load without errors.

### 3. Frontend Environment Check

Verify the React + Vite + Tailwind CSS configuration.

```bash
cd frontend
npm install
npm run dev
```

**Success Criteria:** Visit http://localhost:5173. You should see the application shell with Tailwind styles applied.

---

## Phase 2 Checkpoint: Foundational Logic

Once Phase 2 (Tasks T011-T018) is complete, verify the core backend and frontend logic is in place.

### 1. Git History Audit

Verify the foundational tasks were built incrementally.

```bash
git log -n 8 --oneline
```

**Success Criteria:** You should see commits for T011 through T018, each building on the previous.

### 2. Backend API & Models

Check that the API documentation now shows specific schemas.

```bash
cd backend
uvicorn main:app --reload --port 8000
```

Visit http://127.0.0.1:8000/docs and verify:
- [ ] `FileInfo`, `Flashcard`, `QuizQuestion`, `GradedAnswer` models appear in Schemas section
- [ ] `/health`, `/api/files`, `/api/flashcards`, `/api/quiz`, `/api/quiz/grade` endpoints are listed
- [ ] `/api/files` returns `200 OK` (empty list if no PDFs in `./documents`)

### 3. PDF Extraction Logic

Verify the PDF parsing library imports correctly.

```bash
cd backend
python -c "from tools import extract_text_from_pdf, scan_all_pdfs; print('PDF tools OK')"
```

**Success Criteria:** No import errors. Output shows "PDF tools OK".

### 4. AI Service Readiness

Verify Gemini client configuration.

```bash
cd backend
python -c "from tools import get_gemini_model; m = get_gemini_model(); print('Gemini OK' if m else 'No API key')"
```

**Success Criteria:** 
- [ ] If `GEMINI_API_KEY` is in `.env`: Output shows "Gemini OK"
- [ ] If no key yet: Output shows "No API key" (expected, add key before Phase 4)

### 5. Frontend Architecture

Verify the React app has view state management.

```bash
cd frontend
npm run dev
```

Visit http://localhost:5173 and verify:
- [ ] Header with "The Knowledge Extractor" title displays
- [ ] "Study Mode" and "Quiz Mode" buttons are visible
- [ ] Clicking buttons changes the view (placeholder content is fine)
- [ ] "Home" button appears when not on home view

### 6. Backend File Structure

Verify separation of concerns in backend:

```bash
ls -la backend/*.py
```

**Success Criteria:** You should see:
- `main.py` — App initialization only
- `routes.py` — API endpoint handlers
- `responses.py` — Pydantic models
- `tools.py` — Utility functions

---

## Phase 3 Checkpoint: The Document Browser (MVP) 🎯

**Milestone Achieved:** Users can now see their PDF documents in the application!

Once Phase 3 (Tasks T019-T022) is complete, verify the first functional user story.

### 1. Git History Audit

Verify the document browser was built incrementally.

```bash
git log -n 4 --oneline
```

**Success Criteria:** You should see commits for T019 through T022.

### 2. Backend "Live" Scan

Test that the API can discover PDF files.

```bash
# First, ensure there's at least one PDF in ./documents
ls -la documents/*.pdf

# Test the file discovery endpoint
curl http://127.0.0.1:8000/api/files
```

Or open http://127.0.0.1:8000/docs and test the `/api/files` endpoint.

**Success Criteria:**
- [ ] Response is a JSON array
- [ ] Each item has `name` and `size` properties
- [ ] Your PDF filename(s) appear in the response

### 3. Frontend Integration

Open the React app and verify the FileList component works.

```bash
cd frontend
npm run dev
```

Visit http://localhost:5173 and verify:
- [ ] The "Documents" card appears on the home page
- [ ] Your PDF file(s) are listed with names and file sizes
- [ ] PDF icons with red badges display correctly
- [ ] Hover effects work on file items
- [ ] Refresh button appears in the header

### 4. End-to-End Test

Test that new files are detected.

1. Add a new PDF (or copy/rename an existing one) to `./documents`
2. Click the refresh button in the Documents card (or refresh the browser)

**Success Criteria:**
- [ ] The new file appears in the list
- [ ] File count updates (e.g., "2 PDFs" instead of "1 PDF")
- [ ] File size is displayed correctly

### 5. Empty State Test

Verify the app handles missing documents gracefully.

1. Temporarily move all PDFs out of `./documents`
2. Refresh the page

**Success Criteria:**
- [ ] Empty state message appears: "No PDFs Found"
- [ ] Instructions to add files are displayed
- [ ] Refresh button is available

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Gemini API key

### Backend
```bash
cd backend
pip install -r requirements.txt
echo "GEMINI_API_KEY=your_key_here" > .env
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Use
1. Place PDF files in `./documents`
2. Open http://localhost:5173
3. Click "Study Mode" or "Quiz Mode"

---

## Development Workflow

1. **Read the Constitution** — Understand constraints before coding
2. **Check spec.md** — Know what features are required
3. **Follow tasks.md** — Execute tasks in order
4. **Commit per task** — One task = one commit
5. **Mark complete** — Update `[X]` in tasks.md

---

## License

Demo project for educational purposes.

---

*Built with Spec-Kit + Cursor + Gemini AI*


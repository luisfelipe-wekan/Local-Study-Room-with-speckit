# The Knowledge Extractor

> A local-first study aid built entirely with **Spec-Kit** — an AI-assisted specification-driven development workflow.

---

## 🎓 This Is a Learning Project

**Primary Purpose:** Learn how to use **Spec-Kit**, a specification-driven development methodology for AI-assisted coding with Cursor IDE.

This repository is **not** about the flashcard app itself—it's a complete, working example of the Spec-Kit workflow from start to finish. By studying this project, you'll learn:

1. **How to structure AI prompts** for specification (`/speckit.specify`)
2. **How to plan before coding** with architecture documents (`/speckit.plan`)
3. **How to break work into atomic tasks** with dependencies (`/speckit.tasks`)
4. **How to guide Cursor through implementation** one task at a time
5. **How to maintain clean git history** with one commit per task

> 💡 **Key Insight:** Cursor/AI does NOT automatically commit after each task. You must explicitly instruct it to do so. See [Prompting for Commits](#prompting-for-commits) below.

---

## About the App

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

## ⚠️ Prompting for Commits

> **CRITICAL:** Cursor does NOT automatically create git commits. You MUST explicitly tell it to commit after each task, or you'll lose the traceable history that makes Spec-Kit valuable.

### The Problem

By default, when you run `/speckit.implement`, Cursor will:
- ✅ Create/modify files
- ✅ Mark tasks as complete in `tasks.md`
- ❌ **NOT** create git commits

Without explicit instructions, you'll end up with one giant commit containing all your changes—defeating the purpose of atomic tasks.

### The Solution

Always include commit instructions in your prompt:

```
/speckit.implement

After completing EACH task:
1. Mark it as [X] in tasks.md
2. Run: git add <files> && git commit -m "implement TXXX - <description>"
```

### Example Session

```
User: /speckit.implement for T001 only, commit after completion

Cursor: 
1. Creates documents/README.md
2. Marks T001 as [X] in tasks.md
3. Runs: git add documents/README.md tasks.md && git commit -m "implement T001 - Create documents folder with placeholder README"
```

### For Multiple Tasks

```
User: Execute Phase 1 (T001-T010), commit after EACH task

Cursor:
- T001 → files created → git commit
- T002 → files created → git commit
- T003 → files created → git commit
- ... continues for each task
```

### Verify Your History

After implementation, always check your git log:

```bash
git log --oneline
```

You should see **one commit per task**, like:
```
abc1234 implement T010 - Create React App shell placeholder
def5678 implement T009 - Create FastAPI app skeleton
ghi9012 implement T008 - Create global styles with Tailwind
...
```

If you see only 1-2 commits for many tasks, the AI didn't follow commit instructions—you'll need to be more explicit next time.

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

## Phase 4 Checkpoint: Study Mode (Flashcards)

**Milestone:** AI-powered flashcard generation and interactive study interface

This checkpoint validates Tasks T023-T030 — the complete flashcard user story.

### 1. Git Audit

Verify clean commit trail for Phase 4 tasks.

```bash
cd /home/luis/speckit4/studyroom4
git log -n 8 --oneline
```

**Success Criteria:**
- [ ] Commits for T023 through T030 appear in order
- [ ] Each commit message follows format: `implement TXXX - <description>`
- [ ] No merge conflicts or reverts visible

### 2. AI Payload Test

Test the backend's Gemini integration for flashcard generation.

### Prerequisites
```bash
# Ensure you have a PDF in the documents folder
ls -la documents/*.pdf

# Verify your API key is set
cat backend/.env | grep GEMINI_API_KEY
```

### Test the Endpoint

**Option A: Via curl**
```bash
curl http://127.0.0.1:8000/api/flashcards
```

**Option B: Via Swagger UI**
1. Open http://127.0.0.1:8000/docs
2. Expand `GET /api/flashcards`
3. Click "Try it out" → "Execute"

### Check Backend Logs

Watch the terminal where `uvicorn` is running. You should see:
- Text being extracted from PDF(s)
- Request sent to Gemini API
- JSON response parsed successfully

**Success Criteria:**
- [ ] No "JSON Parsing" errors in terminal
- [ ] Response returns HTTP 200
- [ ] Response contains exactly 10 flashcard objects
- [ ] Each flashcard has `front` and `back` fields

### 3. Interactive UI Check

Test the flashcard user interface.

### Launch Both Servers
```bash
# Terminal 1 - Backend
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Test Flow
1. Open http://localhost:5173
2. Verify PDFs appear in the Documents list
3. Click **"Study Mode"** button

**Success Criteria:**

| Check | Expected Behavior |
|-------|-------------------|
| Card Count | Exactly **10 cards** displayed (progress shows "Card 1 of 10") |
| Flip Animation | Click card → **3D flip** reveals answer on back |
| Next Button | Advances to next card, resets flip state |
| Previous Button | Goes back, works correctly at card 2+ |
| Keyboard Nav | `←` `→` arrows navigate; `Space`/`Enter` flips |
| Progress Bar | Visual bar updates as you navigate |
| Loading State | Spinner + "Generating flashcards..." shown during API call |

### 4. AI Grounding Check

Verify the AI generates contextually relevant content.

### Test Procedure
1. Open one of your PDFs and note a specific topic/term
2. Generate flashcards in the app
3. Browse through all 10 cards

**Success Criteria:**
- [ ] At least **8 of 10** flashcards relate to your PDF content
- [ ] Questions/terms on front are coherent and specific
- [ ] Answers/definitions on back are accurate to the source
- [ ] No hallucinated content unrelated to the document

### 5. Error Handling Check

Test graceful failure modes.

### No PDFs Test
```bash
# Move PDFs out temporarily
mkdir documents/backup
mv documents/*.pdf documents/backup/

# Try generating flashcards
curl http://127.0.0.1:8000/api/flashcards
```

**Success Criteria:**
- [ ] Returns HTTP 404 with message "No PDF documents found"
- [ ] UI shows error state with retry option

### Restore PDFs
```bash
mv documents/backup/*.pdf documents/
rmdir documents/backup
```

### Phase 4 Complete Checklist

| # | Verification | Status |
|---|--------------|--------|
| 1 | Git log shows T023-T030 commits | ⬜ |
| 2 | `/api/flashcards` returns 10 cards | ⬜ |
| 3 | No JSON parsing errors in logs | ⬜ |
| 4 | Card flip animation works | ⬜ |
| 5 | Navigation (buttons + keyboard) works | ⬜ |
| 6 | Content is grounded in PDF | ⬜ |
| 7 | Error states handled gracefully | ⬜ |

**When all boxes are checked, Phase 4: Study Mode is verified!** 🎓

---

## Phase 5 Checkpoint: Quiz Mode & AI Feedback

**Final Feature Verification:** Interactive quiz engine with AI-powered grading

This checkpoint validates Tasks T031-T041 — the complete quiz user story.

### 1. Git Audit

Verify clean commit trail for Phase 5 tasks.

```bash
cd /home/luis/speckit4/studyroom4
git log -n 11 --oneline
```

**Success Criteria:**
- [ ] Commits for T031 through T041 appear in sequence
- [ ] Each commit message follows format: `implement TXXX - <description>`
- [ ] No merge conflicts or reverts visible

### 2. Quiz Generation Test

Verify the backend generates properly structured quiz questions.

**Prerequisites:**
- Backend running (`uvicorn main:app --reload --port 8000`)
- At least one PDF in `./documents`

**Test Steps:**
1. Open the app at http://localhost:5173
2. Click **"Quiz Mode"**
3. Open browser DevTools → Network tab
4. Observe the `/api/quiz` request

**Success Criteria:**
- [ ] Response returns HTTP 200
- [ ] Response contains exactly **10 questions**
- [ ] Each question has `question`, `options` (array of 4), and `correct_index` (0-3)
- [ ] JSON matches the `QuizQuestion` schema from `backend/responses.py`

### 3. Interactive Engine Check

Test the quiz interaction and feedback system.

#### 3.1 Progress Tracking

1. Start a new quiz
2. Answer 3-4 questions

**Success Criteria:**
- [ ] Progress bar updates as questions are answered
- [ ] Counter shows "X of 10 answered"
- [ ] Selected options are highlighted in amber

#### 3.2 Feedback Logic

1. Intentionally select a **wrong answer** for at least one question
2. Submit the quiz

**Success Criteria:**
- [ ] Incorrect answers are highlighted in **red** with ✗ icon
- [ ] Correct answers are highlighted in **green** with ✓ icon
- [ ] AI-generated feedback appears below each question
- [ ] Feedback for wrong answers explains **why** the correct answer is right
- [ ] Feedback content is grounded in the PDF (not generic)

### 4. Result Summary

Complete a full quiz and verify the summary screen.

**Test Steps:**
1. Answer all 10 questions
2. Click "Submit Quiz"
3. Review the results screen

**Success Criteria:**
- [ ] Trophy icon and "Quiz Complete!" message displayed
- [ ] Score shown as **X / 10** format
- [ ] Percentage displayed with color coding:
  - Green (≥70%) | Amber (50-69%) | Red (<50%)
- [ ] All 10 questions visible with feedback
- [ ] "Take New Quiz" button appears

### 5. State Reset

Verify that starting a new quiz resets all state.

**Test Steps:**
1. After completing a quiz, click "Take New Quiz"
2. Alternatively, click "Home" → select different PDF → "Quiz Mode"

**Success Criteria:**
- [ ] Score resets to 0
- [ ] All answer selections cleared
- [ ] New questions generated (not cached)
- [ ] Progress bar resets to empty
- [ ] No stale feedback from previous quiz

### Phase 5 Complete Checklist

| # | Verification | Status |
|---|--------------|--------|
| 1 | Git log shows T031-T041 commits | ⬜ |
| 2 | `/api/quiz` returns 10 valid questions | ⬜ |
| 3 | Progress tracking works correctly | ⬜ |
| 4 | Wrong answers show AI explanations | ⬜ |
| 5 | Score summary displays correctly | ⬜ |
| 6 | "Take New Quiz" resets all state | ⬜ |
| 7 | Feedback is grounded in PDF content | ⬜ |

**When all boxes are checked, Phase 5: Quiz Mode is verified!** 🎓

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Gemini API key (free tier available)

### 🔑 Getting Your Gemini API Key

The app uses Google's Gemini AI for generating flashcards and quizzes. Here's how to get your free API key:

1. **Go to Google AI Studio**
   
   Visit: https://aistudio.google.com/app/apikey

2. **Sign in with Google**
   
   Use any Google account (personal Gmail works fine)

3. **Create API Key**
   
   - Click **"Create API Key"**
   - Select **"Create API key in new project"** (or use existing)
   - Copy the generated key (starts with `AIza...`)

4. **Save to `.env` file**
   
   ```bash
   cd backend
   echo "GEMINI_API_KEY=AIzaSy..." > .env
   ```

> 💡 **Free Tier:** Gemini offers a generous free tier (60 requests/minute). Perfect for learning and personal projects.

> ⚠️ **Security:** Never commit your `.env` file to git! It's already in `.gitignore`.

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


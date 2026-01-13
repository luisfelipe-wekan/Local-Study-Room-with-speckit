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


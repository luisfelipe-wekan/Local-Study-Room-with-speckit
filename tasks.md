# Tasks: The Knowledge Extractor

**Input**: spec.md, plan.md  
**Feature Directory**: `/home/luis/speckit4/studyroom4/`

**User Stories**:
- **US1**: View Documents (P1) — Display detected PDFs from `./documents`
- **US2**: Study Mode (P2) — Generate and flip through 10 flashcards
- **US3**: Quiz Mode (P3) — Take quiz with AI grading and feedback

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Paths: `backend/` and `frontend/` at project root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependencies

- [X] T001 Create `documents/` folder with placeholder README at documents/README.md
- [X] T002 [P] Create backend dependencies file at backend/requirements.txt
- [X] T003 [P] Initialize frontend Vite + React project at frontend/package.json
- [X] T004 [P] Configure Vite with API proxy to backend at frontend/vite.config.js
- [X] T005 [P] Configure Tailwind CSS at frontend/tailwind.config.js and frontend/postcss.config.js
- [X] T006 [P] Create HTML entry point with fonts at frontend/index.html
- [X] T007 [P] Create React entry point at frontend/src/main.jsx
- [X] T008 [P] Create global styles with Tailwind imports at frontend/src/index.css
- [X] T009 [P] Create FastAPI app skeleton with basic health endpoint at backend/main.py
- [X] T010 [P] Create React App shell placeholder at frontend/src/App.jsx

**Checkpoint**: Project structure ready, can install dependencies and run dev servers

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend infrastructure required by ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 Implement PDF text extraction function using pypdf in backend/tools.py
- [X] T012 Implement combined PDF scanner that reads all PDFs from documents/ in backend/tools.py
- [X] T013 Configure Gemini client with API key from .env in backend/tools.py
- [X] T014 Implement JSON response parser for Gemini output in backend/tools.py
- [X] T015 Add CORS middleware and health check endpoint in backend/main.py
- [X] T016 Create App shell with view state management (home/study/quiz) in frontend/src/App.jsx
- [X] T017 Create backend API endpoint stubs (/health, /api/files, /api/flashcards, /api/quiz, /api/quiz/grade) in backend/routes.py
- [X] T018 Create API utility functions (fetchFiles, fetchFlashcards, fetchQuiz, submitQuiz) in frontend/src/api.js

**Checkpoint**: Backend can extract PDFs and call Gemini; Frontend can switch views and call API

---

## Phase 3: User Story 1 — View Documents (Priority: P1) 🎯 MVP

**Goal**: User can see all PDF files detected in the `./documents` folder

**Independent Test**: Open app → See list of PDFs with names and file sizes

### Implementation for User Story 1

- [X] T019 [US1] Implement GET /api/files endpoint returning PDF metadata in backend/routes.py
- [X] T020 [US1] Create FileList component with loading and empty states in frontend/src/components/FileList.jsx
- [X] T021 [US1] Integrate FileList into App home view in frontend/src/App.jsx
- [X] T022 [US1] Style FileList with Tailwind (file icons, sizes, dark theme) in frontend/src/components/FileList.jsx

**Checkpoint**: User Story 1 complete — App displays detected PDFs

---

## Phase 4: User Story 2 — Study Mode (Priority: P2)

**Goal**: User can generate flashcards and flip through them one by one

**Independent Test**: Click "Study Mode" → Loading → See flashcard → Click to flip → Navigate with Previous/Next

### Implementation for User Story 2

- [X] T023 [US2] Implement generate_flashcards_with_gemini async function in backend/tools.py
- [X] T024 [US2] Implement GET /api/flashcards endpoint in backend/routes.py
- [X] T025 [US2] Create Flashcard component with flip animation (CSS 3D transform) in frontend/src/components/Flashcard.jsx
- [X] T026 [US2] Add flashcard state management (currentIndex, isFlipped, cards array) in frontend/src/components/Flashcard.jsx
- [X] T027 [US2] Implement Previous/Next navigation with progress indicator in frontend/src/components/Flashcard.jsx
- [X] T028 [US2] Add keyboard arrow support for navigation in frontend/src/components/Flashcard.jsx
- [X] T029 [US2] Integrate Flashcard into App study view with loading state in frontend/src/App.jsx
- [X] T030 [US2] Style Flashcard with Tailwind (card appearance, flip effect, buttons) in frontend/src/components/Flashcard.jsx

**Checkpoint**: User Story 2 complete — Flashcards generate and flip correctly

---

## Phase 5: User Story 3 — Quiz Mode (Priority: P3)

**Goal**: User can take a quiz, submit answers, and receive AI-graded feedback

**Independent Test**: Click "Quiz Mode" → Loading → See 10 questions → Select answers → Submit → See score and per-question feedback

### Implementation for User Story 3

- [X] T031 [US3] Implement generate_quiz_with_gemini async function in backend/tools.py
- [ ] T032 [US3] Implement GET /api/quiz endpoint in backend/routes.py
- [ ] T033 [US3] Implement grade_quiz_with_gemini async function for AI feedback in backend/tools.py
- [ ] T034 [US3] Implement POST /api/quiz/grade endpoint in backend/routes.py
- [ ] T035 [US3] Create Quiz component displaying all 10 questions with radio options in frontend/src/components/Quiz.jsx
- [ ] T036 [US3] Add quiz state management (questions, answers, submitted, results) in frontend/src/components/Quiz.jsx
- [ ] T037 [US3] Implement answer selection with visual feedback in frontend/src/components/Quiz.jsx
- [ ] T038 [US3] Implement submit button and results display (score, percentage) in frontend/src/components/Quiz.jsx
- [ ] T039 [US3] Display per-question feedback with correct/incorrect indicators in frontend/src/components/Quiz.jsx
- [ ] T040 [US3] Integrate Quiz into App quiz view with loading state in frontend/src/App.jsx
- [ ] T041 [US3] Style Quiz with Tailwind (question cards, options, feedback colors) in frontend/src/components/Quiz.jsx

**Checkpoint**: User Story 3 complete — Full quiz flow works with AI grading

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, UX improvements, final touches

- [ ] T042 [P] Add error states with retry buttons for all API calls in frontend/src/App.jsx
- [ ] T043 [P] Add loading spinners/skeletons for async operations in frontend/src/index.css
- [ ] T044 [P] Ensure responsive design for mobile in all components
- [ ] T045 [P] Add "Back to Home" navigation from Study and Quiz modes in frontend/src/App.jsx
- [ ] T046 Verify all success criteria from spec.md pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — can start first
- **US2 (Phase 4)**: Depends on Foundational — can run parallel to US1
- **US3 (Phase 5)**: Depends on Foundational — can run parallel to US1/US2
- **Polish (Phase 6)**: Depends on all user stories complete

### Within Each User Story

- Backend endpoints before frontend components that use them
- Core functionality before styling
- State management before navigation/interaction

### Parallel Opportunities

**Setup Phase (all [P] tasks):**
```
T002, T003, T004, T005, T006, T007, T008, T009, T010 — all in parallel
```

**After Foundational — User Stories can proceed in parallel:**
```
Developer A: US1 (T019-T022)
Developer B: US2 (T023-T030)  
Developer C: US3 (T031-T041)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (View Documents)
4. **VALIDATE**: App shows PDFs in folder
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → **MVP: Can see files**
3. Add US2 → **Can study with flashcards**
4. Add US3 → **Full app: Quiz with AI grading**
5. Polish → Production-ready

---

## Summary

| Phase | Task Count | Parallel Tasks |
|-------|------------|----------------|
| Phase 1: Setup | 10 | 9 |
| Phase 2: Foundational | 8 | 0 |
| Phase 3: US1 | 4 | 0 |
| Phase 4: US2 | 8 | 0 |
| Phase 5: US3 | 11 | 0 |
| Phase 6: Polish | 5 | 4 |
| **Total** | **46** | **13** |

**MVP Scope**: Phases 1-3 (22 tasks) → View detected PDFs  
**Full App**: All phases (46 tasks) → Complete study experience

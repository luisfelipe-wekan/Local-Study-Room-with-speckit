/**
 * API utility functions for The Knowledge Extractor
 * All API calls to the FastAPI backend.
 */

const API_BASE = "/api";

/**
 * Fetch list of PDF files from the documents folder.
 * @returns {Promise<Array<{name: string, size: number}>>}
 */
export async function fetchFiles() {
    const response = await fetch(`${API_BASE}/files`);
    if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Fetch generated flashcards from PDF content.
 * @returns {Promise<Array<{front: string, back: string}>>}
 */
export async function fetchFlashcards() {
    const response = await fetch(`${API_BASE}/flashcards`);
    if (!response.ok) {
        throw new Error(`Failed to fetch flashcards: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Fetch generated quiz from PDF content.
 * @returns {Promise<Array<{question: string, options: string[], correct_index: number}>>}
 */
export async function fetchQuiz() {
    const response = await fetch(`${API_BASE}/quiz`);
    if (!response.ok) {
        throw new Error(`Failed to fetch quiz: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Submit quiz answers for grading.
 * @param {Array<{question_index: number, selected_index: number, question: string, options: string[], correct_index: number}>} answers
 * @returns {Promise<Array<{question_index: number, is_correct: boolean, feedback: string}>>}
 */
export async function submitQuiz(answers) {
    const response = await fetch(`${API_BASE}/quiz/grade`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
    });
    if (!response.ok) {
        throw new Error(`Failed to submit quiz: ${response.statusText}`);
    }
    return response.json();
}


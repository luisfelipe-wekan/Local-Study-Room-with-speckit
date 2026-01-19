/**
 * Quiz Component
 * Displays quiz questions, handles answer selection, submission, and shows graded results.
 */

import { useEffect, useState } from "react";
import {
    CheckCircle,
    XCircle,
    Loader2,
    RotateCcw,
    Send,
    Trophy,
} from "lucide-react";
import { fetchQuiz, submitQuiz } from "../api";

function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { questionIndex: selectedIndex }
    const [results, setResults] = useState(null); // Graded results array
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Fetch quiz on mount
    useEffect(() => {
        loadQuiz();
    }, []);

    const loadQuiz = async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        setAnswers({});
        try {
            const data = await fetchQuiz();
            setQuestions(data);
        } catch (err) {
            setError(err.message || "Failed to generate quiz");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle answer selection
    const selectAnswer = (questionIndex, optionIndex) => {
        if (results) return; // Don't allow changes after submission
        setAnswers((prev) => ({
            ...prev,
            [questionIndex]: optionIndex,
        }));
    };

    // Check if all questions are answered
    const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

    // Submit quiz for grading
    const handleSubmit = async () => {
        if (!allAnswered) return;

        setIsSubmitting(true);
        setError(null);

        // Build submission payload
        const submission = questions.map((q, idx) => ({
            question_index: idx,
            selected_index: answers[idx],
            question: q.question,
            options: q.options,
            correct_index: q.correct_index,
        }));

        try {
            const graded = await submitQuiz(submission);
            setResults(graded);
        } catch (err) {
            setError(err.message || "Failed to grade quiz");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate score
    const getScore = () => {
        if (!results) return { correct: 0, total: 0, percentage: 0 };
        const correct = results.filter((r) => r.is_correct).length;
        const total = results.length;
        const percentage = Math.round((correct / total) * 100);
        return { correct, total, percentage };
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-parchment-300 text-lg">Generating quiz with AI...</p>
                <p className="text-parchment-300/50 text-sm mt-2">This may take a few seconds</p>
            </div>
        );
    }

    // Error state
    if (error && questions.length === 0) {
        return (
            <div className="card p-8 text-center max-w-md mx-auto">
                <p className="text-crimson-400 mb-4">{error}</p>
                <button onClick={loadQuiz} className="btn-secondary inline-flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        );
    }

    const score = getScore();

    return (
        <div className="max-w-3xl mx-auto px-2 sm:px-0">
            {/* Score Summary (after submission) */}
            {results && (
                <div className="card p-4 sm:p-6 mb-6 sm:mb-8 text-center bg-gradient-to-br from-ink-700 to-ink-800">
                    <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-xl sm:text-2xl font-semibold text-parchment-100 mb-2">
                        Quiz Complete!
                    </h3>
                    <div className="text-3xl sm:text-4xl font-bold text-amber-500 mb-2">
                        {score.correct} / {score.total}
                    </div>
                    <p className="text-parchment-300 mb-4 text-sm sm:text-base">
                        You scored{" "}
                        <span
                            className={
                                score.percentage >= 70
                                    ? "text-emerald-400 font-semibold"
                                    : score.percentage >= 50
                                        ? "text-amber-400 font-semibold"
                                        : "text-crimson-400 font-semibold"
                            }
                        >
                            {score.percentage}%
                        </span>
                    </p>
                    <button
                        onClick={loadQuiz}
                        className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Take New Quiz
                    </button>
                </div>
            )}

            {/* Progress indicator (before submission) */}
            {!results && (
                <div className="mb-6 text-center">
                    <span className="text-parchment-300 font-mono text-sm">
                        {Object.keys(answers).length} of {questions.length} answered
                    </span>
                    <div className="mt-2 h-1 bg-ink-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-500 transition-all duration-300"
                            style={{
                                width: `${(Object.keys(answers).length / questions.length) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Questions */}
            <div className="space-y-4 sm:space-y-6">
                {questions.map((question, qIdx) => {
                    const result = results?.find((r) => r.question_index === qIdx);
                    const selectedAnswer = answers[qIdx];

                    return (
                        <div
                            key={qIdx}
                            className={`card p-4 sm:p-6 ${result
                                ? result.is_correct
                                    ? "border-emerald-500/50"
                                    : "border-crimson-500/50"
                                : ""
                                }`}
                        >
                            {/* Question header */}
                            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center font-mono text-xs sm:text-sm">
                                    {qIdx + 1}
                                </span>
                                <p className="text-base sm:text-lg text-parchment-100 flex-1">
                                    {question.question}
                                </p>
                                {result && (
                                    result.is_correct ? (
                                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-crimson-400 flex-shrink-0" />
                                    )
                                )}
                            </div>

                            {/* Options */}
                            <div className="space-y-2 ml-0 sm:ml-12">
                                {question.options.map((option, oIdx) => {
                                    const isSelected = selectedAnswer === oIdx;
                                    const isCorrect = question.correct_index === oIdx;
                                    const showCorrect = results && isCorrect;
                                    const showIncorrect = results && isSelected && !isCorrect;

                                    return (
                                        <button
                                            key={oIdx}
                                            onClick={() => selectAnswer(qIdx, oIdx)}
                                            disabled={!!results}
                                            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${showCorrect
                                                ? "bg-emerald-500/20 border-emerald-500 text-emerald-100"
                                                : showIncorrect
                                                    ? "bg-crimson-500/20 border-crimson-500 text-crimson-100"
                                                    : isSelected
                                                        ? "bg-amber-500/20 border-amber-500 text-parchment-100"
                                                        : "bg-ink-700/50 border-ink-600 text-parchment-200 hover:border-ink-500 hover:bg-ink-700"
                                                } ${results ? "cursor-default" : "cursor-pointer"}`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span
                                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-mono ${showCorrect
                                                        ? "border-emerald-400 bg-emerald-500 text-white"
                                                        : showIncorrect
                                                            ? "border-crimson-400 bg-crimson-500 text-white"
                                                            : isSelected
                                                                ? "border-amber-400 bg-amber-500 text-ink-900"
                                                                : "border-ink-500"
                                                        }`}
                                                >
                                                    {String.fromCharCode(65 + oIdx)}
                                                </span>
                                                {option}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Feedback (after submission) */}
                            {result && (
                                <div
                                    className={`mt-3 sm:mt-4 ml-0 sm:ml-12 p-3 rounded-lg ${result.is_correct
                                        ? "bg-emerald-500/10 text-emerald-200"
                                        : "bg-crimson-500/10 text-crimson-200"
                                        }`}
                                >
                                    <p className="text-xs sm:text-sm">{result.feedback}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Submit button (before submission) */}
            {!results && (
                <div className="mt-6 sm:mt-8 text-center">
                    {error && (
                        <p className="text-crimson-400 mb-4 text-sm">{error}</p>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={!allAnswered || isSubmitting}
                        className="btn-primary inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                Grading...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                Submit Quiz
                            </>
                        )}
                    </button>
                    {!allAnswered && (
                        <p className="text-parchment-300/50 text-xs sm:text-sm mt-2">
                            Answer all questions to submit
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Quiz;


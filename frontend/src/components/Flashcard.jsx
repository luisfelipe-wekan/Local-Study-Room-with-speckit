/**
 * Flashcard Component
 * Displays flashcards with flip animation and navigation.
 */

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Loader2 } from "lucide-react";
import { fetchFlashcards } from "../api";

function Flashcard() {
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch flashcards on mount
    useEffect(() => {
        loadFlashcards();
    }, []);

    const loadFlashcards = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchFlashcards();
            setCards(data);
            setCurrentIndex(0);
            setIsFlipped(false);
        } catch (err) {
            setError(err.message || "Failed to generate flashcards");
        } finally {
            setIsLoading(false);
        }
    };

    // Navigation handlers
    const goToNext = useCallback(() => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
        }
    }, [currentIndex, cards.length]);

    const goToPrevious = useCallback(() => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
        }
    }, [currentIndex]);

    const flipCard = () => {
        setIsFlipped((prev) => !prev);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    goToPrevious();
                    break;
                case "ArrowRight":
                    goToNext();
                    break;
                case " ":
                case "Enter":
                    e.preventDefault();
                    flipCard();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goToNext, goToPrevious]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-parchment-300 text-lg">Generating flashcards with AI...</p>
                <p className="text-parchment-300/50 text-sm mt-2">This may take a few seconds</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="card p-8 text-center max-w-md mx-auto">
                <p className="text-crimson-400 mb-4">{error}</p>
                <button onClick={loadFlashcards} className="btn-secondary inline-flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        );
    }

    // No cards state
    if (cards.length === 0) {
        return (
            <div className="card p-8 text-center max-w-md mx-auto">
                <p className="text-parchment-300 mb-4">No flashcards were generated.</p>
                <button onClick={loadFlashcards} className="btn-secondary inline-flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <div className="max-w-2xl mx-auto px-2 sm:px-0">
            {/* Progress indicator */}
            <div className="mb-4 sm:mb-6 text-center">
                <span className="text-parchment-300 font-mono text-xs sm:text-sm">
                    Card {currentIndex + 1} of {cards.length}
                </span>
                <div className="mt-2 h-1 bg-ink-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Flashcard */}
            <div
                className="flip-card h-64 sm:h-80 cursor-pointer mb-4 sm:mb-6"
                onClick={flipCard}
            >
                <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
                    {/* Front */}
                    <div className="flip-card-front card p-4 sm:p-8 flex items-center justify-center bg-gradient-to-br from-ink-700 to-ink-800">
                        <p className="text-base sm:text-xl text-parchment-100 text-center leading-relaxed">
                            {currentCard.front}
                        </p>
                    </div>

                    {/* Back */}
                    <div className="flip-card-back card p-4 sm:p-8 flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-ink-800">
                        <p className="text-base sm:text-xl text-parchment-100 text-center leading-relaxed">
                            {currentCard.back}
                        </p>
                    </div>
                </div>
            </div>

            {/* Flip hint */}
            <p className="text-center text-parchment-300/50 text-xs sm:text-sm mb-4 sm:mb-6">
                Tap card or press Space to flip
            </p>

            {/* Navigation buttons */}
            <div className="flex items-center justify-center gap-2 sm:gap-4">
                <button
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                    className="btn-secondary flex items-center gap-1 sm:gap-2 py-2 px-3 sm:py-3 sm:px-6 text-sm sm:text-base disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                </button>

                <button
                    onClick={goToNext}
                    disabled={currentIndex === cards.length - 1}
                    className="btn-primary flex items-center gap-1 sm:gap-2 py-2 px-3 sm:py-3 sm:px-6 text-sm sm:text-base disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>

            {/* Keyboard hint - hide on mobile */}
            <p className="hidden sm:block text-center text-parchment-300/50 text-xs mt-4">
                Use ← → arrow keys to navigate
            </p>
        </div>
    );
}

export default Flashcard;


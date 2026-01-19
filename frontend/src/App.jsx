/**
 * The Knowledge Extractor - Main App Component
 * Manages view state (home/study/quiz) and renders appropriate content.
 */

import { useState } from "react";
import { BookOpen, Brain, Home, RefreshCw, AlertTriangle } from "lucide-react";
import FileList from "./components/FileList";
import Flashcard from "./components/Flashcard";
import Quiz from "./components/Quiz";

// View constants
const VIEWS = {
    HOME: "home",
    STUDY: "study",
    QUIZ: "quiz",
};

function App() {
    const [currentView, setCurrentView] = useState(VIEWS.HOME);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Navigation handler
    const navigateTo = (view) => {
        setError(null);
        setCurrentView(view);
    };

    // Render navigation buttons for home view
    const renderHomeNav = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-12">
            <button
                onClick={() => navigateTo(VIEWS.STUDY)}
                className="btn-primary flex items-center justify-center gap-3 py-6 text-lg"
            >
                <BookOpen className="w-6 h-6" />
                Study Mode
            </button>
            <button
                onClick={() => navigateTo(VIEWS.QUIZ)}
                className="btn-primary flex items-center justify-center gap-3 py-6 text-lg"
            >
                <Brain className="w-6 h-6" />
                Quiz Mode
            </button>
        </div>
    );

    // Render current view content
    const renderContent = () => {
        switch (currentView) {
            case VIEWS.HOME:
                return (
                    <div>
                        {/* File List Section */}
                        <div className="mb-8">
                            <FileList />
                        </div>

                        {/* Welcome Message */}
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-parchment-100 mb-4">
                                Ready to Study?
                            </h2>
                            <p className="text-parchment-300 max-w-lg mx-auto mb-8">
                                Select a study mode below to generate flashcards or take a quiz
                                based on your PDF documents.
                            </p>
                            {renderHomeNav()}
                        </div>
                    </div>
                );

            case VIEWS.STUDY:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold text-parchment-100 text-center mb-8">
                            📚 Study Mode
                        </h2>
                        <Flashcard />
                    </div>
                );

            case VIEWS.QUIZ:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold text-parchment-100 text-center mb-8">
                            🧠 Quiz Mode
                        </h2>
                        <Quiz />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-ink-900 text-parchment-100 font-serif">
            {/* Header */}
            <header className="p-6 border-b border-ink-700">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-amber-500">
                            The Knowledge Extractor
                        </h1>
                        <p className="text-parchment-300 mt-1">
                            Transform your PDFs into interactive study materials
                        </p>
                    </div>

                    {/* Back to Home button (only show when not on home) */}
                    {currentView !== VIEWS.HOME && (
                        <button
                            onClick={() => navigateTo(VIEWS.HOME)}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6 max-w-4xl mx-auto">
                {/* Error display with retry */}
                {error && (
                    <div className="mb-6 p-6 bg-crimson-500/10 border border-crimson-500/50 rounded-xl">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-6 h-6 text-crimson-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-crimson-400 font-semibold mb-1">Something went wrong</h3>
                                <p className="text-crimson-300/80 text-sm mb-4">{error}</p>
                                <button
                                    onClick={() => {
                                        setError(null);
                                        // Reload the page to reset state
                                        window.location.reload();
                                    }}
                                    className="btn-secondary inline-flex items-center gap-2 text-sm py-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading state */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="spinner mb-4"></div>
                        <p className="text-parchment-300">Loading...</p>
                    </div>
                ) : (
                    renderContent()
                )}
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-parchment-300/50 text-sm border-t border-ink-800 bg-ink-900">
                Powered by Gemini AI • Local-first study aid
            </footer>
        </div>
    );
}

export default App;

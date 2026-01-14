/**
 * The Knowledge Extractor - Main App Component
 * Manages view state (home/study/quiz) and renders appropriate content.
 */

import { useState } from "react";
import { BookOpen, Brain, FileText, Home } from "lucide-react";

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
                    <div className="text-center">
                        <div className="flex justify-center mb-8">
                            <FileText className="w-24 h-24 text-amber-500 opacity-50" />
                        </div>
                        <h2 className="text-2xl font-semibold text-parchment-100 mb-4">
                            Welcome to The Knowledge Extractor
                        </h2>
                        <p className="text-parchment-300 max-w-lg mx-auto mb-8">
                            Place your PDF documents in the <code className="font-mono bg-ink-700 px-2 py-1 rounded">./documents</code> folder,
                            then choose a study mode below.
                        </p>
                        {renderHomeNav()}
                    </div>
                );

            case VIEWS.STUDY:
                return (
                    <div className="text-center">
                        <p className="text-parchment-300">
                            Flashcard component will be integrated here in Phase 4.
                        </p>
                    </div>
                );

            case VIEWS.QUIZ:
                return (
                    <div className="text-center">
                        <p className="text-parchment-300">
                            Quiz component will be integrated here in Phase 5.
                        </p>
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
                {/* Error display */}
                {error && (
                    <div className="mb-6 p-4 bg-crimson-500/20 border border-crimson-500 rounded-lg text-crimson-400">
                        {error}
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

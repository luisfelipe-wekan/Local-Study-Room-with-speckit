/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Scholarly dark theme with warm accents
                'ink': {
                    900: '#0f0f0f',
                    800: '#1a1a1a',
                    700: '#2a2a2a',
                    600: '#3a3a3a',
                },
                'parchment': {
                    100: '#faf8f5',
                    200: '#f5f0e8',
                    300: '#e8e0d4',
                },
                'amber': {
                    400: '#f4a342',
                    500: '#e8912e',
                    600: '#d47f1c',
                },
                'sage': {
                    400: '#6b9b7a',
                    500: '#4a8a5d',
                },
                'crimson': {
                    400: '#dc6b6b',
                    500: '#c74a4a',
                }
            },
            fontFamily: {
                'serif': ['Crimson Pro', 'Georgia', 'serif'],
                'mono': ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}


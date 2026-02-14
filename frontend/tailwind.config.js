/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
                mono: ['JetBrains Mono', 'monospace'],
                display: ['Oswald', 'sans-serif'], // For Streetwear
            },
            colors: {
                primary: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                secondary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                // Fashion / Clothes Theme (Editorial)
                fashion: {
                    50: '#fdfbf7',
                    100: '#f7f3ec',
                    200: '#e8dfd2',
                    300: '#d5c4b0',
                    400: '#bc9e85',
                    500: '#a67c5b',
                    600: '#8c6346',
                    700: '#704c36',
                    800: '#5c3e2e',
                    900: '#4d3428',
                    accent: '#1a1a1a', // Charcoal
                },
                // Street / Shoes Theme (Hypebeast)
                street: {
                    50: '#f2f2f2',
                    100: '#e6e6e6',
                    200: '#cccccc',
                    300: '#b3b3b3',
                    400: '#999999',
                    500: '#808080',
                    600: '#666666',
                    700: '#4d4d4d',
                    800: '#333333',
                    900: '#1a1a1a',
                    accent: '#ccff00', // Volt/Neon
                },
                // Food Theme (Organic)
                organic: {
                    50: '#fefce8',
                    100: '#fef9c3',
                    200: '#fef08a',
                    300: '#fde047',
                    400: '#facc15',
                    500: '#eab308',
                    600: '#ca8a04',
                    700: '#a16207',
                    800: '#854d0e',
                    900: '#713f12',
                    accent: '#65a30d', // Fresh Green
                }
            },
        },
    },
    plugins: [],
}

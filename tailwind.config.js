/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563eb',
                secondary: '#10b981',
                accent: '#f59e0b',
            },
            boxShadow: {
                '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.5)',
                'glow': '0 0 20px rgba(96, 165, 250, 0.5)',
                'glow-lg': '0 0 40px rgba(96, 165, 250, 0.6)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}

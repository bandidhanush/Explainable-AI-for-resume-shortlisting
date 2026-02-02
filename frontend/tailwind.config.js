/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Premium Slate Scale
                background: '#020617', // Slate 950
                surface: '#0f172a',    // Slate 900
                'surface-highlight': '#1e293b', // Slate 800
                border: '#334155',     // Slate 700

                // Text
                heading: '#f8fafc',    // Slate 50
                body: '#94a3b8',       // Slate 400

                // Brand Colors
                primary: {
                    DEFAULT: '#6366f1', // Indigo 500
                    hover: '#4f46e5',   // Indigo 600
                    glow: 'rgba(99, 102, 241, 0.5)'
                },
                secondary: {
                    DEFAULT: '#10b981', // Emerald 500
                    glow: 'rgba(16, 185, 129, 0.5)'
                },
                accent: '#8b5cf6',      // Violet 500
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'mesh-gradient': 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%)',
                'glass-gradient': 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.6) 100%)',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                'glow-primary': '0 0 20px -5px rgba(99, 102, 241, 0.4)',
                'glow-secondary': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ecff',
          200: '#c7dcfe',
          300: '#a0c4fd',
          400: '#70a2fc',
          500: '#417df8',
          600: '#1e5aee',
          700: '#1444db',
          800: '#1638b1',
          900: '#0f276b',
          950: '#0a1945',
        },
        navy: {
          800: '#111b2e',
          900: '#0b1120',
          950: '#060a14',
        },
        civic: {
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          indigo: '#6366f1',
          sky: '#0284c7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

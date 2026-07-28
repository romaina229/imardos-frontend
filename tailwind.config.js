/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'imardos-blue': '#0f3b76',
        'imardos-light-blue': '#eef2f7',
        'imardos-orange': '#f59e0b',
        'imardos-green': '#10b981',
        'imardos-red': '#ef4444',
        'imardos-dark': '#1e293b',
      },
    },
  },
  plugins: [],
}
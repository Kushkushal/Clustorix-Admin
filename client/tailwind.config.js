/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'clustorix-primary': '#4F46E5', // Example primary color
        'clustorix-secondary': '#FBBF24', // Example secondary color (Indian vibe)
        'clustorix-background': '#F9FAFB',
      },
    },
  },
  plugins: [],
}


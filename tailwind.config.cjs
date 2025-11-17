/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './**/*.{ts,tsx,js,jsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'byd-red': '#d9001b',
        'byd-red-dark': '#a50014',
      }
    }
  },
  plugins: [],
}

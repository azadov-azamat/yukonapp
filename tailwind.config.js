/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./<custom directory>/**/*.{js,jsx,ts,tsx}",
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'border-color': 'var(--border-color)',
        'primary-red': 'var(--primary-red)',
        secondary: 'var(--secondary)',
        background: 'var(--background)',
        text: 'var(--text)',
      }
    },
  },
  plugins: [],
}


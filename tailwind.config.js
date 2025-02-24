/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'selector',
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
        'primary': '#623bff',
        'border-color': '#ced4da',
        'primary-red': '#eb5757',
        'secondary': "#6B7280", 
        'primary-dark': '#000000',
        'primary-light': '#ffffff',
        'primary-title-color':'#000000',
        'primary-descr-color': '#ced4da'
      }
    },
  },
  plugins: [],
}


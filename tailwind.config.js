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
        'primary-purple': 'rgba(126,34,206,1.00)',
        'border-color': '#ced4da',
        'primary-red': '#eb5757',
        'secondary': "#6B7280", 
        'primary-dark': '#000000',
        'primary-light': '#ffffff',
        'primary-title-color':'#000000',
        'primary-descr-color': 'rgba(51, 65, 85, 1.00)',
        'card-background': 'rgba(243,244,246,1.00)'
      }
    },
  },
  plugins: [],
}


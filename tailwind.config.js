/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pharmaglow: {
          teal: '#0A5265',
          'teal-light': '#0E748B',
          'teal-hover': '#084353',
          'teal-soft': '#E3F6FA',
          rose: '#D95370',
          'rose-light': '#E87A90',
          'rose-soft': '#FDEBF0',
          lavender: '#7969E6',
          'lavender-soft': '#F0EDFE',
          navy: '#0B1B2B',
          'navy-light': '#122A3F',
          ivory: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', '"Segoe UI"', 'serif'],
      }
    },
  },
  plugins: [],
}



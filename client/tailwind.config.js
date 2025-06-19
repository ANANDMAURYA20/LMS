/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00', // Main orange
          light: '#FF8533',   // Lighter orange
          dark: '#CC5500'     // Darker orange
        },
        secondary: {
          DEFAULT: '#1A1A1A',  // Main black
          light: '#333333',    // Light black
          dark: '#000000'      // Pure black
        },
        accent: {
          DEFAULT: '#FFFFFF',  // Pure white
          dark: '#F5F5F5',     // Off white
          gray: '#E5E5E5'      // Light gray
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'nunito-sans': ['Nunito Sans', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'hover': '0 8px 12px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  darkMode: 'class',
  plugins: [require('daisyui')],
}
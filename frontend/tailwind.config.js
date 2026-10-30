/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#090D1A',
        darkCard: '#111728',
        darkBorder: 'rgba(255, 255, 255, 0.1)',
        brand: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          dark: '#4338CA',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'sans-serif'], // Keeps backward compatibility with elements using font-serif
      },
      maxWidth: {
        content: '1120px',
      },
    },
  },
  plugins: [],
};

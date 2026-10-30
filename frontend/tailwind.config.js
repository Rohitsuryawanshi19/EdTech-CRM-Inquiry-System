/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FBF7F0',
          alt: '#F3ECE0',
        },
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1E2A3A',
          soft: '#556070',
        },
        line: '#E2D9C8',
        brand: {
          DEFAULT: '#1F5F4A',
          dark: '#164636',
        },
        accent: '#D9552B',
        turmeric: '#E8A317',
        'slate-blue': '#2F5D8A',
        chip: {
          newBg: '#FFF3D6',
          newText: '#8A5A00',
          progressBg: '#E4EEF8',
          progressText: '#1F4E79',
          resolvedBg: '#E0F0E8',
          resolvedText: '#1F5F4A',
        },
        error: {
          DEFAULT: '#B3261E',
          bg: '#FDECEA',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['"Public Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
        input: '8px',
        btn: '8px',
        chip: '999px',
      },
      boxShadow: {
        warm: '0 1px 2px rgba(30, 42, 58, 0.06), 0 4px 12px rgba(30, 42, 58, 0.05)',
      },
      maxWidth: {
        content: '1120px',
      },
    },
  },
  plugins: [],
};

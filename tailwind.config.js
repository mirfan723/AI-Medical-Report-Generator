/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0f9',
          100: '#cce1f3',
          200: '#99c3e7',
          300: '#66a5db',
          400: '#3387cf',
          500: '#0A6EBD', // main primary
          600: '#085897',
          700: '#064271',
          800: '#042c4b',
          900: '#021624',
        },
        secondary: {
          50: '#eef9fa',
          100: '#dcf3f5',
          200: '#b9e7eb',
          300: '#96dbe1',
          400: '#74cfd7',
          500: '#53BFC9', // main secondary
          600: '#3a969e',
          700: '#276c72',
          800: '#14484c',
          900: '#082426',
        },
        accent: {
          50: '#f0edff',
          100: '#e1dbff',
          200: '#c4b7ff',
          300: '#a693ff',
          400: '#896ffd',
          500: '#7752FE', // main accent
          600: '#5f41cb',
          700: '#473098',
          800: '#2f2066',
          900: '#171033',
        },
        success: {
          500: '#22c55e',
        },
        warning: {
          500: '#f59e0b',
        },
        error: {
          500: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.5s ease-in-out',
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out',
        'slide-left': 'slide-left 1s ease-out',
        'slide-right': 'slide-right 1s ease-out',
        'slide-up': 'slide-up 1s ease-out',
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fill, minmax(200px,1fr))',
      },
    },
  },
  plugins: [],
}

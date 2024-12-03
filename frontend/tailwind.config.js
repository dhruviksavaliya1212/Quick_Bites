/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes:{
        wiggle:{
          '0%':{width:'0%'},
          '100%':{width:'100%'}
        }
      },
      animation:{
        wiggle:'wiggle 0.3s ease-in-out'
      },
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(200px,1fr))'
      }
    },
  },
  plugins: [],
}
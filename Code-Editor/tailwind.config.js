/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f0a19',
          card: '#1a1325',
          border: '#2d1b3d',
        }
      }
    },
  },
  plugins: [],
}



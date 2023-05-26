/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'Sans-serif']
      },
      backgroundImage: {
        'reg-pattern': "linear-gradient(45deg, #00000069, #00000069), url('/src/assets/images/auth-bg.jpg')",
        'login-pattern': "linear-gradient(45deg, #00000069, #00000069), url('/src/assets/images/login.jpg')",
      }
    },
  },
  plugins: [],
}
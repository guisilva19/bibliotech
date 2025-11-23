/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f8b71",   // verde suave
        primaryDark: "#3a6f5a", // verde petróleo
        background: "#f6e9cc", // bege claro
        surface: "#fffdf7",    // branco quente
        accent: "#5fa786",     // verde claro
        text: "#2f2f2f",
      },
    },
  },
  plugins: [],
};

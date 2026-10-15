/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1e3c72",
        teal: "#14b8a8",
      },
    },
  },
  plugins: [],
};

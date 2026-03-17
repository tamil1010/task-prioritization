/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#06B6D4",
        secondary: "#0EA5E9",
        background: "#020617",
        card: "#0F172A",
        glow: "#22D3EE",
      },
      boxShadow: {
        neon: "0 0 10px theme(colors.glow), 0 0 20px theme(colors.glow)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}
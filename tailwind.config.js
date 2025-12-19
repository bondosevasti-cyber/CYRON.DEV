/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"], // ეს ეუბნება, რომ ფაილები ძირითად საქაღალდეშია
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FCEE0A", // Neon Yellow
        "background-light": "#F0F2F5",
        "background-dark": "#050505",
        "surface-light": "#FFFFFF",
        "surface-dark": "#0F0F12",
        "accent-dark": "#1A1A1F",
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Rajdhani", "sans-serif"],
        georgian: ["Noto Sans Georgian", "sans-serif"],
      },
      backgroundImage: {
        'grid-light': "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
        'grid-dark': "linear-gradient(to right, #1f1f1f 1px, transparent 1px), linear-gradient(to bottom, #1f1f1f 1px, transparent 1px)",
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
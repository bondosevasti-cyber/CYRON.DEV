/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#FFD700", // Sunny Yellow (Button/Accent)
        secondary: "#FF7F50", // Coral Pink
        accent: "#4169E1", // Royal Blue
        background: "#FFFFFF", // White
        surface: "#FFFFFF",
        "text-main": "#1A1A1A",
        "brand-green": "#4ADE80",
        red: "#EF4444",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Nunito", "sans-serif"],
        georgian: ["Noto Sans Georgian", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem", // rounded-2xl feel by default
        '3xl': '1.5rem',
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px #000000',
        'hard-white': '4px 4px 0px 0px #ffffff',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
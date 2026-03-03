/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#FBBF24", // Yellow 400
        secondary: "#3B82F6", // Blue 500
        accent: "#FBBF24",
        background: "#0B0F19", // Dark Theme Body
        surface: "rgba(255, 255, 255, 0.05)", // Glass background
        "text-main": "#FFFFFF",
      },
      fontFamily: {
        display: ["'Spline Sans'", "sans-serif"],
        body: ["'Spline Sans'", "sans-serif"],
        georgian: ["Noto Sans Georgian", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'neon-yellow': '0 0 20px rgba(250, 204, 21, 0.2)',
      },
      backdropBlur: {
        'xl': '20px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
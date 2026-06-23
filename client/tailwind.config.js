/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A", // Dark Slate Blue Background
        card: "#1E293B",       // Slightly lighter slate blue card
        accent: "#3B82F6",     // Brilliant blue accent
        accentHover: "#2563EB",// Darker blue for hover states
        textPrimary: "#F8FAFC",// Ice white text
        textSecondary: "#94A3B8"// Muted slate gray text
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

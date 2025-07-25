/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "warm-brown": "#8B5529",
        "soft-cream": "#F5E8C7",
        "muted-beige": "#D3C7B0",
      },
      fontFamily: {
        "plus-jakarta-sans": ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

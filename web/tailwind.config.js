const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      primary: colors.neutral[950],
      accent: "#f4f4f5",
      ...colors,
    },
  },
  plugins: [require("tailwindcss-animate")],
};

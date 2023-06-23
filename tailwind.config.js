const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-ginto)", ...defaultTheme.fontFamily.sans],
      gintoNord: ["var(--font-ginto-nord)", ...defaultTheme.fontFamily.sans],
    },
    fontSize: {
      xs: "0.7rem",
      sm: "0.8125rem",
      base: "0.9375rem",
      lg: "1.25rem",
      xl: "1.5rem",
      "2xl": "1.875rem",
      "3xl": "3.625rem",
      "4xl": "3.75rem",
      "5xl": "7.5rem",
    },
  },
  plugins: [],
};

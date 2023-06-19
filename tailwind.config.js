const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      none: "#FFFFFF0",
      blackWood: "#272E29",
      darkSky: "#464646",
      shade: "#383838",
      lightSky: "#DCDCDC",
      darkForest: "#3D4B41",
      lightForest: "#C3E4CD",
      darkAzalea: "#5A4E4C",
      lightAzalea: "#F5D4D2",
      darkLavender: "#565467",
      lightLavender: "#DBCCF3",
      lightDandelion: "#D0DBFF",
      darkDandelion: "#474B57",
      paleSunflower: "#FFEBB8",
      dustyMiller: "#E9E9E9",
      velvet: "#360C0C",
      transparent: "#transparent",
      gray: "#939399",
      dark: "#000000",
      light: "#FFFFFF",
      x: "#FF0000", // for dev purposes
    },
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

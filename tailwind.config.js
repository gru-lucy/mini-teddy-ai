const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        DEFAULT: "var(--shadow-default)",
        200: "var(--shadow-200)",
        300: "var(--shadow-300)",
      },
      colors: {
        background: {
          100: "var(--bg-100)",
        },
        white: {
          100: "var(--white-100)",
          200: "var(--white-200)",
        },
        black: {
          100: "var(--black-100)",
          200: "var(--black-200)",
          300: "var(--black-300)",
        },
        yellow: {
          100: "var(--yellow-100)",
        },
        gray: {
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
        },
        blue: {
          100: "var(--blue-100)",
          200: "var(--blue-200)",
          300: "var(--blue-300)",
        },
        red: {
          100: "var(--red-100)",
          200: "var(--red-200)",
        },
        green: {
          100: "var(--green-100)",
          200: "var(--green-200)",
        },
        syntax: {
          color: "var(--syntax-color)",
          background: "var(--syntax-background)",
        },
        scrollbar: {
          thumb: "var(--scrollbar-thumb)",
          "thumb-hover": "var(--scrollbar-thumb-hover)",
        },
        selection: {
          background: "var(--selection-background)",
          color: "var(--selection-color)",
        },
      },
      fontFamily: {
        sans: ["GT Walsheim", ...defaultTheme.fontFamily.sans],
        mono: ["League Mono", ...defaultTheme.fontFamily.mono],
        serif: ["Kenfolg", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
};

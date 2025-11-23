import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
        '5xl': '3840px'
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      prefix: "heroui",
      addCommonColors: false,
      defaultTheme: "light",
      defaultExtendTheme: "light",
      layout: {
        dividerWeight: "1px",
        disabledOpacity: 0.5,
        fontSize: {
          tiny: "0.78rem", // text-tiny
          small: "0.875rem", // text-small
          medium: "1rem", // text-medium
          large: "1.125rem", // text-large
        },
      },
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#7C3AED", // base
              foreground: "#FFFFFF", // good contrast for text/icons

              50: "#F5F3FF",
              100: "#EDE9FE",
              200: "#DDD6FE",
              300: "#C4B5FD",
              400: "#A78BFA",
              500: "#8B5CF6",
              600: "#7C3AED", // your DEFAULT
              700: "#6D28D9",
              800: "#5B21B6",
              900: "#4C1D95",
            },
          }
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#7C3AED", // base
              foreground: "#FFFFFF", // good contrast for text/icons

              50: "#F5F3FF",
              100: "#EDE9FE",
              200: "#DDD6FE",
              300: "#C4B5FD",
              400: "#A78BFA",
              500: "#8B5CF6",
              600: "#7C3AED", // your DEFAULT
              700: "#6D28D9",
              800: "#5B21B6",
              900: "#4C1D95",
            },
          }
        },
      }
    }),
  ],
}

module.exports = config

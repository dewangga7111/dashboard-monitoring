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
              DEFAULT: "#59718B",
              foreground: "#FFFFFF",

              50: "#EEF3F6",
              100: "#DCE5ED",
              200: "#B8CBDC",
              300: "#94B1CB",
              400: "#6F97B9",
              500: "#59718B", // DEFAULT
              600: "#4A5E74",
              700: "#3A4B5D",
              800: "#2B3946",
              900: "#1B262F",
            }

          }
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#59718B",
              foreground: "#FFFFFF",

              50: "#EEF3F6",
              100: "#DCE5ED",
              200: "#B8CBDC",
              300: "#94B1CB",
              400: "#6F97B9",
              500: "#59718B", // DEFAULT
              600: "#4A5E74",
              700: "#3A4B5D",
              800: "#2B3946",
              900: "#1B262F",
            }
          }
        },
      }
    }),
  ],
}

module.exports = config

import { nextui } from "@nextui-org/theme";
import { COLORS } from "./config/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: {
        light: COLORS.LILAC,
        DEFAULT: COLORS.SOFT_PURPLE,
      },
      secondary: {
        light: COLORS.SOFT_PINK,
        DEFAULT: COLORS.FUCHSIA,
      },
      success: {
        DEFAULT: COLORS.MINT_GREEN,
      },
      warning: {
        DEFAULT: COLORS.MID_YELLOW,
      },
      danger: {
        DEFAULT: COLORS.FUCHSIA,
      },
      black: {
        100: COLORS.SOFT_GRAY,
        200: COLORS.LIGHT_GRAY,
        300: COLORS.GRAY_STROKE,
        500: COLORS.MID_GRAY,
        DEFAULT: COLORS.DARK_GRAY,
      },
      white: {
        DEFAULT: COLORS.PURE_WHITE,
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: COLORS.SOFT_PURPLE,
            },
            secondary: {
              foreground: COLORS.SOFT_PINK,
              DEFAULT: COLORS.FUCHSIA,
            },
            success: {
              DEFAULT: COLORS.MINT_GREEN,
            },
            warning: {
              DEFAULT: COLORS.MID_YELLOW,
            },
            danger: {
              DEFAULT: COLORS.FUCHSIA,
            },
            default: {
              DEFAULT: COLORS.WHITE,
            },
          },
        },
        dark: {
          // ...
          colors: {},
        },
      },
    }),
  ],
};

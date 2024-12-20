import { nextui } from "@nextui-org/react";
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
        DEFAULT: COLORS.DARK_GRAY,
      },
      secondary: {
        light: COLORS.SOFT_PINK,
        DEFAULT: COLORS.SOFT_PURPLE,
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
            foreground: COLORS.MID_GRAY,
            primary: {
              DEFAULT: COLORS.DARK_GRAY,
            },
            secondary: {
              foreground: COLORS.PURE_WHITE,
              DEFAULT: COLORS.SOFT_PURPLE,
            },
            success: {
              900: COLORS.DARK_GREEN,
              DEFAULT: COLORS.MINT_GREEN,
            },
            warning: {
              DEFAULT: COLORS.MID_YELLOW,
            },
            danger: {
              DEFAULT: COLORS.FUCHSIA,
            },
            default: {
              DEFAULT: COLORS.SOFT_GRAY,
            },
            background: {
              DEFAULT: COLORS.BACKGROUND,
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

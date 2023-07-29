import {
  COLORS,
  EXTENDED_SPACING,
  FONT_SIZES,
  EXTENDED_TRANSITION,
  SPACING,
  toPxTheme,
} from "./src/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{index,vue,js,ts,jsx,tsx}"],
  theme: {
    borderRadius: toPxTheme("borderRadius"),
    lineHeight: toPxTheme("lineHeight"),
    maxWidth: toPxTheme("maxWidth"),
    fontSize: FONT_SIZES,
    extend: {
      colors: COLORS,
      spacing: { ...SPACING, ...EXTENDED_SPACING },
      fontFamily: {
        custom: [
          "Roboto",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      minWidth: {
        ...SPACING,
        ...EXTENDED_SPACING,
      },
      transitionProperty: EXTENDED_TRANSITION,
      transitionDuration: {
        DEFAULT: "250ms",
      },
    },
  },

  plugins: [],
};

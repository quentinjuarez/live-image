import theme from "tailwindcss/defaultTheme";
import {
  generateConfig,
  generateConfigWithColors,
} from "tailwindcss-custom-colors";

export const COLORS = {
  ...generateConfig(["primary"]),
  ...generateConfigWithColors([{ color: "#FF0000", name: "red" }]),
};

export const EXTENDED_SPACING = {
  4.5: "18px",
  5.5: "22px",
  6.5: "26px",
  7.5: "30px",
  8.5: "34px",
  9.5: "38px",
};
export const FONT_SIZES = {
  "3xs": ["8px", { lineHeight: "10px" }],
  "2xs": ["10px", { lineHeight: "12px" }],
  xs: ["12px", { lineHeight: "14px" }],
  sm: ["14px", { lineHeight: "17px" }],
  base: ["16px", { lineHeight: "19px" }],
  lg: ["18px", { lineHeight: "22px" }],
  xl: ["20px", { lineHeight: "26px" }],
  "2xl": ["24px", { lineHeight: "30px" }],
  "3xl": ["28px", { lineHeight: "34px" }],
};
export const EXTENDED_TRANSITION = {
  height: "height, max-height, min-height",
  width: "width, max-width, min-width",
};

// Inspired from https://github.com/tailwindlabs/tailwindcss/issues/800#issuecomment-974620969
const deepMap = (val: (typeof theme)[ThemeKeys]) => {
  const it = (val: any): unknown => {
    if (Array.isArray(val)) return val.map(it);
    if (typeof val === "object") {
      const res: any = {};
      for (const key of Object.keys(val)) {
        res[key] = it(val[key]);
      }
      return res;
    }
    return toPx(val);
  };
  return it(val);
};
const toPx = (val: string | unknown) => {
  if (typeof val === "string")
    val = val.replace(/((\d*\.)?\d+)rem\b/g, (_match, num) => `${16 * +num}px`);
  return val;
};
type ThemeKeys = "borderRadius" | "lineHeight" | "maxWidth" | "spacing";

export const toPxTheme = (key: ThemeKeys) => deepMap(theme[key]);

export const SPACING = deepMap(theme.spacing);

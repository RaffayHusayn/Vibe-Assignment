import { createTheme, type MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = createTheme({
  fontFamily: "var(--font-geist-sans), sans-serif",
  fontFamilyMonospace: "var(--font-geist-mono), monospace",

  fontSizes: {
    xs: "0.8125rem",
    sm: "0.9375rem",
    md: "1.0625rem",
    lg: "1.1875rem",
    xl: "1.3125rem",
  },

  lineHeights: {
    xs: "1.4",
    sm: "1.45",
    md: "1.55",
    lg: "1.6",
    xl: "1.65",
  },

  fontWeights: {
    regular: "400",
    medium: "500",
    bold: "700",
  },

  headings: {
    fontFamily: "var(--font-geist-sans), sans-serif",
    fontWeight: "600",
    sizes: {
      h1: { fontSize: "2.5rem", lineHeight: "1.2" },
      h2: { fontSize: "2rem", lineHeight: "1.25" },
      h3: { fontSize: "1.625rem", lineHeight: "1.3" },
      h4: { fontSize: "1.375rem", lineHeight: "1.35" },
      h5: { fontSize: "1.25rem", lineHeight: "1.4" },
      h6: { fontSize: "1.125rem", lineHeight: "1.4" },
    },
  },

  defaultRadius: "md",
});

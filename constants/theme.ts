// QPON Color Palette
export const Colors = {
  // Primary Colors
  purple: "#5200BC",
  purpleLight: "#7B3BD4",
  purpleDark: "#3D008C",

  // Secondary Colors
  orange: "#FF5A00",
  orangeLight: "#FF7A33",
  orangeDark: "#CC4800",

  // Background Colors
  deepNavy: "#021030",
  deepNavyLight: "#0A1A40",
  deepNavyDark: "#010820",

  // Accent Colors
  teal: "#00DBEE",
  tealLight: "#33E2F1",
  tealDark: "#00B0BE",

  blue: "#2966EF",
  blueLight: "#5485F2",
  blueDark: "#1E4FBF",

  green: "#A6FE5A",
  greenLight: "#BAFE7E",
  greenDark: "#85CB48",

  // Status Colors
  success: "#10B981",
  successLight: "rgba(16, 185, 129, 0.1)",
  error: "#EF4444",
  errorLight: "rgba(239, 68, 68, 0.1)",

  // Neutral Colors
  white: "#FFFFFF",
  black: "#000000",
  gray100: "#F5F5F7",
  gray200: "#E5E5EA",
  gray300: "#D1D1D6",
  gray400: "#AEAEB2",
  gray500: "#8E8E93",
  gray600: "#636366",
  gray700: "#48484A",
  gray800: "#3A3A3C",
  gray900: "#2C2C2E",

  // Text Colors
  textPrimary: "#FFFFFF",
  textSecondary: "#B8B8D0",
  textMuted: "#6E6E8A",
};

// Font Family Configuration
export const Fonts = {
  // Heading Font - Quicksand
  heading: {
    light: "Quicksand_300Light",
    regular: "Quicksand_400Regular",
    medium: "Quicksand_500Medium",
    semiBold: "Quicksand_600SemiBold",
    bold: "Quicksand_700Bold",
  },
  // Body Font - Manrope
  body: {
    extraLight: "Manrope_200ExtraLight",
    light: "Manrope_300Light",
    regular: "Manrope_400Regular",
    medium: "Manrope_500Medium",
    semiBold: "Manrope_600SemiBold",
    bold: "Manrope_700Bold",
    extraBold: "Manrope_800ExtraBold",
  },
};

// Typography Styles
export const Typography = {
  h1: {
    fontFamily: Fonts.heading.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: Fonts.heading.bold,
    fontSize: 26,
    lineHeight: 34,
  },
  h3: {
    fontFamily: Fonts.heading.semiBold,
    fontSize: 22,
    lineHeight: 28,
  },
  h4: {
    fontFamily: Fonts.heading.semiBold,
    fontSize: 18,
    lineHeight: 24,
  },
  body: {
    fontFamily: Fonts.body.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 16,
    lineHeight: 20,
  },
  caption: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    lineHeight: 16,
  },
};

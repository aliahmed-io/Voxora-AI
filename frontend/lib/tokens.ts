/**
 * Voxora AI Design System Tokens
 * Conforming to Rule 5 (8pt Grid), Rule 13 (Design Tokens & Types module),
 * and the 60-30-10 Editorial Palette:
 * - 60% Dominant: Pastel Orchid Pink (#E7B0DE / #FBF3F9)
 * - 30% Structural: Deep Eggplant Violet (#400849)
 * - 10% High-Voltage Accent: Signal Orange (#FF5A0A)
 */

export const colors = {
  // 10% High-Voltage Accent
  signalOrange: "#FF5A0A",
  signalOrangeHover: "#E04D05",
  signalOrangeGhost: "#FFF2EC",
  signalOrangeHalo: "rgba(255, 90, 10, 0.20)",

  // 30% Structural Deep Velvet
  eggplant: "#400849",
  eggplantHover: "#2F0536",
  eggplantSoft: "#631A70",
  eggplantGhost: "#F6E9F8",
  eggplantHalo: "rgba(64, 8, 73, 0.15)",

  // 60% Dominant Pastel Foundation
  orchid: "#E7B0DE",
  orchidSoft: "#F3DCF0",
  orchidGhost: "#FAEEF7",
  bgBase: "#FBF3F9",
  bgCard: "#FFFFFF",
  bgSubtle: "#FAF0F8",

  // Typography & Ink
  primary: "#400849",
  primaryHover: "#2F0536",
  ink: "#400849",
  inkMuted: "#71367B",
  inkSubtle: "#A872AF",

  // Borders & Glows
  borderLight: "rgba(231, 176, 222, 0.40)",
  borderHover: "rgba(64, 8, 73, 0.30)",

  // Sentiments (aligned with palette)
  sentiment: {
    positive: "#10B981",
    positiveGhost: "#ECFDF5",
    positiveBorder: "rgba(16, 185, 129, 0.25)",
    neutral: "#FF5A0A", // Signal Orange for neutral/opportunity
    neutralGhost: "#FFF2EC",
    neutralBorder: "rgba(255, 90, 10, 0.25)",
    negative: "#E11D48",
    negativeGhost: "#FFE4E6",
    negativeBorder: "rgba(225, 29, 72, 0.25)",
  }
} as const;

export const spacing = {
  grid: 8, // 8pt baseline grid
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
  xxxl: 64,
} as const;

export const typography = {
  fonts: {
    display: "'Plus Jakarta Sans', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },
  sizes: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
    "5xl": "48px",
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  }
} as const;

export const radii = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  full: "9999px",
} as const;

export const motionDurations = {
  instant: 150,
  normal: 250,
  smooth: 400,
} as const;

export type VoxoraColors = typeof colors;
export type VoxoraSpacing = typeof spacing;
export type VoxoraTypography = typeof typography;
export type VoxoraRadii = typeof radii;
export type SentimentType = "positive" | "neutral" | "negative";

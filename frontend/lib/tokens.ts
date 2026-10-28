/**
 * Voxora AI Design System Tokens
 * Conforming to Rule 5 (8pt Grid) and Rule 13 (Design Tokens & Types module).
 */

export const colors = {
  primary: "#6D4AFF",
  primaryHover: "#5B39EE",
  primarySoft: "#B6A4FF",
  primaryGhost: "#ECE7FF",
  primaryHalo: "rgba(109, 74, 255, 0.12)",
  bgBase: "#F5F2FF",
  bgCard: "#FFFFFF",
  bgSubtle: "#FAF8FF",
  ink: "#161327",
  inkMuted: "#625D7E",
  inkSubtle: "#9B94B8",
  borderLight: "rgba(109, 74, 255, 0.10)",
  borderHover: "rgba(109, 74, 255, 0.25)",
  accentAmber: "#FFB86B",
  sentiment: {
    positive: "#10B981",
    positiveGhost: "#ECFDF5",
    positiveBorder: "rgba(16, 185, 129, 0.25)",
    neutral: "#F59E0B",
    neutralGhost: "#FFFBEB",
    neutralBorder: "rgba(245, 158, 11, 0.25)",
    negative: "#F43F5E",
    negativeGhost: "#FFF1F2",
    negativeBorder: "rgba(244, 63, 94, 0.25)",
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

/**
 * Tokens compartidos por las primitivas de charts del DS.
 *
 * Centraliza la paleta de colores y la familia tipográfica usadas
 * por `ChartBar`, `ChartLine`, `ChartArea`, `ChartDonut`,
 * `ChartPie` y `ChartRadialBar`.
 */

export const CHART_COLORS = {
  brand500: "#465FFF",
  brand200: "#9CB9FF",
  brandTeal: "#0FADFF",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
} as const;

export const CHART_DEFAULT_FONT = "Outfit, sans-serif";

/** Paleta ordenada para charts circulares (pie/donut/radial). */
export const CHART_CIRCULAR_PALETTE: string[] = [
  CHART_COLORS.brand500,
  CHART_COLORS.brand200,
  CHART_COLORS.brandTeal,
  CHART_COLORS.gray500,
];

/** Paleta ordenada para charts de barras/líneas con múltiples series. */
export const CHART_SERIES_PALETTE: string[] = [
  CHART_COLORS.brand500,
  CHART_COLORS.brand200,
  CHART_COLORS.brandTeal,
];

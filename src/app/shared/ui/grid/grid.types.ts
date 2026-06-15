/**
 * Breakpoints en los que la grilla pasa a multi-columna.
 * Default `sm` (≥640px). Mapea al prefijo de Tailwind.
 */
export type GridBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

/**
 * Cantidad de columnas que puede renderizar `UiGrid`.
 * En mobile siempre se renderiza a 1 columna.
 */
export type GridColumns = 2 | 3 | 4 | 5 | 6;

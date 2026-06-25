/**
 * Tipos del `UiSeparator`.
 */

/**
 * Orientación del separador.
 *
 * - `horizontal` (default): línea horizontal (`<hr>` con altura mínima).
 * - `vertical`: línea vertical (`<hr>` rotado, útil para sidebar / toolbars).
 */
export type SeparatorOrientation = "horizontal" | "vertical";

/**
 * Estilo del trazo.
 *
 * - `solid` (default): línea continua.
 * - `dashed`: línea discontinua (`border-dashed`).
 * - `dotted`: línea punteada (`border-dotted`).
 */
export type SeparatorVariant = "solid" | "dashed" | "dotted";

/**
 * Grosor del trazo.
 *
 * - `thin` (default): 1px.
 * - `medium`: 2px.
 * - `thick`: 4px.
 */
export type SeparatorThickness = "thin" | "medium" | "thick";

/**
 * Espaciado (margin) alrededor del separador.
 *
 * - `none` (default): sin margen.
 * - `sm`: margen pequeño (m-2).
 * - `md`: margen medio (m-4).
 * - `lg`: margen grande (m-6).
 */
export type SeparatorSpacing = "none" | "sm" | "md" | "lg";

/**
 * Color semántico del separador.
 *
 * - `gray` (default): gris neutro (bordes estándar).
 * - `subtle`: gris muy claro, para separaciones suaves.
 * - `brand`: color de marca, para separaciones con énfasis.
 * - `danger`: rojo semántico.
 */
export type SeparatorColor = "gray" | "subtle" | "brand" | "danger";

/**
 * Props del `UiSeparatorComponent`.
 */
export interface SeparatorProps {
  orientation?: SeparatorOrientation;
  variant?: SeparatorVariant;
  thickness?: SeparatorThickness;
  spacing?: SeparatorSpacing;
  color?: SeparatorColor;
  className?: string;
}

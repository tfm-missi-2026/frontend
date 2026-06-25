import { BadgeColor, BadgeVariant } from "@shared/ui/badge";

/**
 * Tipos del `UiCard`.
 */

/**
 * Padding interno del card.
 *
 * - `none`: sin padding (útil cuando el consumidor controla el espacio).
 * - `sm`: padding pequeño.
 * - `md` (default): padding estándar (`p-5 sm:p-6`).
 * - `lg`: padding amplio.
 */
export type CardPadding = "none" | "sm" | "md" | "lg";

/**
 * Estilo visual del card.
 *
 * - `default` (default): borde sutil + fondo blanco.
 * - `elevated`: borde + sombra ligera.
 * - `flat`: solo fondo, sin borde.
 */
export type CardVariant = "default" | "elevated" | "flat";

/**
 * Props del `UiCardComponent`.
 */
export interface CardProps {
  /** Padding interno. Default: `md`. */
  padding?: CardPadding;
  /** Variante visual. Default: `default`. */
  variant?: CardVariant;
  /** Clases extra aplicadas al contenedor. */
  className?: string;
  /** Título opcional renderizado con `UiHeader` (nivel 3). */
  title?: string;
  /** Descripción opcional renderizada con `UiLabel` (párrafo bodyS). */
  description?: string;
  /** Texto del badge opcional en la esquina superior derecha. */
  badge?: string;
  /** Color del badge. Default: `primary`. */
  badgeColor?: BadgeColor;
  /** Variante del badge. Default: `light`. */
  badgeVariant?: BadgeVariant;
  /** Si `true`, dibuja un `UiSeparator` entre la cabecera y el contenido. */
  divider?: boolean;
}

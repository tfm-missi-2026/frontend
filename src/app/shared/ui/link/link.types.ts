import { Type } from "@angular/core";

import { IconProps } from "@shared/ui/icon/icon.interface";

/**
 * Variante visual del link. Define la jerarquía de color.
 *
 * - `primary`: color de marca (default).
 * - `secondary`: gris neutro.
 * - `danger`: rojo semántico (errores, acciones destructivas).
 * - `subtle`: tono bajo, ideal para ayudas o notas.
 * - `unstyled`: hereda los estilos del contexto (sin color propio).
 */
export type LinkVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "subtle"
  | "unstyled";

/**
 * Tamaño tipográfico del link.
 */
export type LinkSize = "sm" | "md" | "lg";

/**
 * Comportamiento del subrayado.
 *
 * - `hover` (default): subrayado solo al hacer hover/focus.
 * - `always`: subrayado permanente.
 * - `none`: nunca subrayado.
 */
export type LinkUnderline = "hover" | "always" | "none";

/**
 * Props del `UiLinkComponent`.
 *
 * Réplica de la API link del proyecto React.
 */
export interface LinkProps {
  /** Ruta del router-link (router path, no URL absoluta). */
  to?: string;

  /** URL absoluta para enlaces externos. Tiene precedencia sobre `to` si ambos están definidos. */
  href?: string;

  /** Variante visual. Default: `primary`. */
  variant?: LinkVariant;

  /** Tamaño tipográfico. Default: `md`. */
  size?: LinkSize;

  /** Comportamiento del subrayado. Default: `hover`. */
  underline?: LinkUnderline;

  /** Si `true`, renderiza el link como deshabilitado (no navega ni emite click). */
  disabled?: boolean;

  /** Atributo `target` del `<a>`. */
  target?: "_blank" | "_self" | "_parent" | "_top" | string;

  /** Atributo `rel` del `<a>`. Si `target="_blank"` y no se define, se setea `noopener noreferrer`. */
  rel?: string;

  /** Mapea a `aria-label` cuando el contenido visible no es descriptivo. */
  labelText?: string;

  /** Componente Angular a la izquierda del texto. */
  leftIcon?: Type<unknown>;

  /** Componente Angular a la derecha del texto. */
  rightIcon?: Type<unknown>;

  /** Props para los íconos. */
  iconProps?: IconProps;

  /** Texto alternativo al slot `<ng-content>`. */
  label?: string;

  /** Clases extra aplicadas al `<a>`. */
  className?: string;
}

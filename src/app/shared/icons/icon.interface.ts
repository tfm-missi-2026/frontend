/**
 * Props comunes para los iconos del design system.
 */
export interface IconProps {
  /** Tamaño base del icono (en px o palabra clave de tamaño). */
  size?: number | string;
  /** Ancho explícito (sobrescribe `size`). */
  width?: number | string;
  /** Alto explícito (sobrescribe `size`). */
  height?: number | string;
  /** Color del icono (acepta cualquier valor CSS válido, por defecto `currentColor`). */
  color?: string;
  /** Clases extra para el `<svg>`. */
  className?: string;
  /** `data-testid` para pruebas. */
  dataTestId?: string;
  /** Estilos inline adicionales. */
  style?: Record<string, unknown>;
}

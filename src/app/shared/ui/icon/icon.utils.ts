/**
 * Variantes semánticas del `UiIcon`. Mapean al color de texto del
 * design system (mismas reglas que `COLOR_CLASSES`) para que el
 * icono reaccione al cambio de tema.
 */
export type IconVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

/**
 * Clases Tailwind (light + dark) por variante semántica.
 * Solo color de texto — el icono interno usa `fill="currentColor"`.
 */
export const ICON_VARIANT_CLASSES: Record<IconVariant, string> = {
  success: 'text-success-500 dark:text-success-400',
  error: 'text-error-500 dark:text-error-400',
  warning: 'text-warning-500 dark:text-warning-400',
  info: 'text-blue-light-500 dark:text-blue-light-400',
  neutral: 'text-gray-500 dark:text-gray-400',
};

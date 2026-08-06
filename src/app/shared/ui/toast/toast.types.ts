/**
 * Variantes semánticas del `UiToast`. Definen color de fondo, borde
 * e icono asociado. Independiente de `UiAlert` para que el toast
 * pueda evolucionar sin acoplar su ciclo de vida al del alert.
 */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

/**
 * Posiciones disponibles para un `UiToast`. Determinan las clases
 * Tailwind de `fixed *-*` que se aplican al contenedor.
 */
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';
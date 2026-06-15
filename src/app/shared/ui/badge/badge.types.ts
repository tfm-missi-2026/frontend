/**
 * Variante visual del badge: fondo translúcido o color sólido.
 */
export type BadgeVariant = 'light' | 'solid';

/**
 * Tamaño tipográfico del badge.
 */
export type BadgeSize = 'sm' | 'md';

/**
 * Paleta semántica del badge. Se combina con `variant` para definir
 * el color final de fondo y de texto.
 */
export type BadgeColor =
  | 'primary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

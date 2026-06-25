/**
 * Variantes semánticas del `UiSurface`. Definen borde y fondo con
 * su contraparte `dark:` para que el contenedor reaccione al cambio
 * de tema. Se mapean a clases Tailwind literales en
 * `surface.variants.ts`.
 */
export type SurfaceVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

/**
 * Padding interno del `UiSurface`. Default: `md`.
 */
export type SurfacePadding = 'none' | 'sm' | 'md' | 'lg';

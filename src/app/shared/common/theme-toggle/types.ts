/**
 * Tipos del `CommonThemeToggle`.
 */

/**
 * Estilo visual del botón.
 *
 * - `subtle` (default): botón monocromo gris/blanco, hereda la paleta
 *   del layout principal (header autenticado).
 * - `brand`: círculo sólido con color de marca (auth layout).
 */
export type CommonThemeToggleVariant = 'subtle' | 'brand';

/**
 * Tamaño del botón.
 *
 * - `sm`: 36×36 px (h-9 w-9).
 * - `md` (default): 44×44 px (h-11 w-11).
 * - `lg`: 56×56 px (size-14).
 */
export type CommonThemeToggleSize = 'sm' | 'md' | 'lg';

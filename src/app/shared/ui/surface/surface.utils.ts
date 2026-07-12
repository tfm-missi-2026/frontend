import { SurfacePadding, SurfaceVariant } from './surface.types';

/** Padding Tailwind por `SurfacePadding`. */
export const SURFACE_PADDING_CLASSES: Record<SurfacePadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

/**
 * Clases Tailwind (light + dark) por variante semántica.
 * Borde + fondo en la misma línea para que `JIT` las detecte como
 * literales (no se interpolan).
 */
export const SURFACE_VARIANT_CLASSES: Record<SurfaceVariant, string> = {
  success:
    'border-success-500 bg-success-100 dark:border-success-500/30 dark:bg-success-500/15',
  error:
    'border-error-500 bg-error-100 dark:border-error-500/30 dark:bg-error-500/15',
  warning:
    'border-warning-500 bg-warning-100 dark:border-warning-500/30 dark:bg-warning-500/15',
  info:
    'border-blue-light-500 bg-blue-light-100 dark:border-blue-light-500/30 dark:bg-blue-light-500/15',
  neutral:
    'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-white/5',
};

/** Clases base comunes a todas las superficies. */
export const SURFACE_BASE_CLASSES = 'rounded-xl border';

import { SurfaceVariant } from '@shared/ui/surface/surface.types';
import { ToastPosition, ToastVariant } from './toast.types';

/** Variante del `UiSurface` a aplicar según la variante del toast. */
export const TOAST_SURFACE_VARIANT: Record<ToastVariant, SurfaceVariant> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

/** Clases Tailwind (`fixed *-*`) por posición del toast. */
export const TOAST_POSITION_CLASSES: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};
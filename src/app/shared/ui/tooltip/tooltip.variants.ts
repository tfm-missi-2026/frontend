import { TooltipSide, TooltipVariantType } from './tooltip.types';

/**
 * Clases Tailwind por variante en modo claro del tema.
 */
export const LIGHT_VARIANT_CLASSES: Record<TooltipVariantType, string> = {
  light:
    'bg-white text-gray-800 border border-gray-200 px-3 py-3 text-sm leading-5',
  dark: 'bg-gray-900 text-white px-2 py-1 text-xs leading-4.5',
  info:
    'bg-blue-light-50 text-blue-light-900 border border-blue-light-200 ' +
    'px-2 py-1 text-xs leading-4.5',
  success:
    'bg-success-50 text-success-900 border border-success-200 ' +
    'px-2 py-1 text-xs leading-4.5',
  warning:
    'bg-warning-50 text-warning-900 border border-warning-200 ' +
    'px-2 py-1 text-xs leading-4.5',
  error:
    'bg-error-50 text-error-900 border border-error-200 ' +
    'px-2 py-1 text-xs leading-4.5',
};

/**
 * Clases Tailwind por variante en modo oscuro del tema. Se invierten
 * fondo y texto para mantener el contraste.
 */
export const DARK_VARIANT_CLASSES: Record<TooltipVariantType, string> = {
  light:
    'bg-gray-800 text-gray-100 border border-gray-700 ' +
    'px-3 py-3 text-sm leading-5',
  dark: 'bg-gray-900 text-white px-2 py-1 text-xs leading-4.5',
  info:
    'bg-blue-light-900/30 text-blue-light-100 border border-blue-light-800 ' +
    'px-2 py-1 text-xs leading-4.5',
  success:
    'bg-success-900/30 text-success-100 border border-success-800 ' +
    'px-2 py-1 text-xs leading-4.5',
  warning:
    'bg-warning-900/30 text-warning-100 border border-warning-800 ' +
    'px-2 py-1 text-xs leading-4.5',
  error:
    'bg-error-900/30 text-error-100 border border-error-800 ' +
    'px-2 py-1 text-xs leading-4.5',
};

/**
 * Clases de `translate-*` para la animación direccional por lado.
 * `from` se aplica cuando el tooltip está cerrado y `to` cuando está abierto.
 */
export const SIDE_TRANSLATE_CLASSES: Record<
  TooltipSide,
  { from: string; to: string }
> = {
  top: { from: '-translate-y-1', to: 'translate-y-0' },
  bottom: { from: 'translate-y-1', to: 'translate-y-0' },
  left: { from: '-translate-x-1', to: 'translate-x-0' },
  right: { from: 'translate-x-1', to: 'translate-x-0' },
};
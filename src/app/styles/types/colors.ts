/**
 * Tipos de color semánticos del design system.
 * Mapean a las variables CSS de Tailwind ya definidas en `styles.css`.
 */

export type ColorType =
  | 'textStrong'
  | 'textWeak'
  | 'textWeakest'
  | 'textDisabled'
  | 'textAction'
  | 'textActionStrong'
  | 'textError'
  | 'textSuccess'
  | 'textWarning'
  | 'backgroundInput'
  | 'backgroundInputDisabled'
  | 'backgroundWidget'
  | 'borderStrong'
  | 'borderWeak'
  | 'borderError'
  | 'borderSuccess'
  | 'foregroundHover'
  | 'foregroundSelected'
  | 'foregroundFocus';

/** Valor CSS (var(--…)) asociado a cada color semántico. */
export const COLORS: Record<ColorType, string> = {
  textStrong: 'var(--color-gray-800)',
  textWeak: 'var(--color-gray-500)',
  textWeakest: 'var(--color-gray-400)',
  textDisabled: 'var(--color-gray-300)',
  textAction: 'var(--color-brand-500)',
  textActionStrong: 'var(--color-brand-600)',
  textError: 'var(--color-error-500)',
  textSuccess: 'var(--color-success-500)',
  textWarning: 'var(--color-warning-500)',
  backgroundInput: 'var(--color-white)',
  backgroundInputDisabled: 'var(--color-gray-50)',
  backgroundWidget: 'var(--color-white)',
  borderStrong: 'var(--color-gray-300)',
  borderWeak: 'var(--color-gray-200)',
  borderError: 'var(--color-error-500)',
  borderSuccess: 'var(--color-success-500)',
  foregroundHover: 'var(--color-gray-100)',
  foregroundSelected: 'var(--color-brand-50)',
  foregroundFocus: 'var(--color-brand-500)',
};

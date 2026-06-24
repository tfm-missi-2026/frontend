/**
 * Tipos de color semánticos del design system.
 * Mapean a clases Tailwind light + dark (ver `COLOR_CLASSES`).
 *
 * Cada color tiene una variante light (`text-gray-800`) y una dark
 * (`dark:text-white/90`) para mantener contraste en ambos modos.
 * Las primitivas aplican las clases vía `[class]`, NO vía `style.color`,
 * para que las variantes `dark:` tomen efecto.
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

/**
 * Clases Tailwind (light + dark) por color semántico.
 * Usadas por primitivas (`UiHeader`, `UiLabel`, etc.) que aplican color
 * vía clase, no via `style.color`, para que las variantes `dark:` respondan.
 */
export const COLOR_CLASSES: Record<ColorType, string> = {
  textStrong: 'text-gray-800 dark:text-white/90',
  textWeak: 'text-gray-500 dark:text-gray-400',
  textWeakest: 'text-gray-400 dark:text-gray-500',
  textDisabled: 'text-gray-300 dark:text-gray-600',
  textAction: 'text-brand-500 dark:text-brand-400',
  textActionStrong: 'text-brand-600 dark:text-brand-300',
  textError: 'text-error-500 dark:text-error-400',
  textSuccess: 'text-success-500 dark:text-success-400',
  textWarning: 'text-warning-500 dark:text-warning-400',
  backgroundInput: 'bg-white dark:bg-gray-900',
  backgroundInputDisabled: 'bg-gray-50 dark:bg-gray-800',
  backgroundWidget: 'bg-white dark:bg-gray-900',
  borderStrong: 'border-gray-300 dark:border-gray-700',
  borderWeak: 'border-gray-200 dark:border-gray-800',
  borderError: 'border-error-500 dark:border-error-400',
  borderSuccess: 'border-success-500 dark:border-success-400',
  foregroundHover: 'bg-gray-100 dark:bg-white/5',
  foregroundSelected: 'bg-brand-50 dark:bg-brand-500/10',
  foregroundFocus: 'border-brand-500 dark:border-brand-400',
};

/**
 * @deprecated Mantenido para retrocompatibilidad con consumidores que aún
 * esperan un valor CSS `var(--…)`. Las primitivas modernas usan
 * `COLOR_CLASSES` en su lugar. Úsalo solo si necesitas aplicar el color
 * a un estilo inline (poco recomendado).
 */
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

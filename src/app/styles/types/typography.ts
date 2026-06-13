/**
 * Tipos de tipografía y constantes del design system.
 * Replican los valores que el proyecto React carga desde `designConstants`.
 */

export type FontWeightType = 'regular' | 'medium' | 'semibold' | 'bold';

export type TypographyType =
  | 'bodyXxs'
  | 'bodyXs'
  | 'bodyS'
  | 'HeadingXs'
  | 'HeadingS'
  | 'HeadingM'
  | 'HeadingL'
  | 'HeadingXl'
  | 'HeadingXxl'
  | 'HeadingTV';

/** `font-size` por tipo (en px). */
export const TYPOGRAPHY_FONT_SIZE: Record<TypographyType, string> = {
  bodyXxs: '12px',
  bodyXs: '14px',
  bodyS: '14px',
  HeadingXs: '12px',
  HeadingS: '14px',
  HeadingM: '16px',
  HeadingL: '18px',
  HeadingXl: '20px',
  HeadingXxl: '24px',
  HeadingTV: '30px',
};

/** `line-height` por tipo (en px). */
export const TYPOGRAPHY_LINE_HEIGHT: Record<TypographyType, string> = {
  bodyXxs: '18px',
  bodyXs: '20px',
  bodyS: '20px',
  HeadingXs: '18px',
  HeadingS: '20px',
  HeadingM: '24px',
  HeadingL: '28px',
  HeadingXl: '30px',
  HeadingXxl: '32px',
  HeadingTV: '38px',
};

/** `font-weight` numérico. */
export const TYPOGRAPHY_FONT_WEIGHT: Record<FontWeightType, number> = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

/** `font-weight` por defecto para cada tipo de tipografía. */
export const TYPOGRAPHY_DEFAULT_WEIGHT: Record<TypographyType, FontWeightType> = {
  bodyXxs: 'regular',
  bodyXs: 'regular',
  bodyS: 'regular',
  HeadingXs: 'semibold',
  HeadingS: 'semibold',
  HeadingM: 'semibold',
  HeadingL: 'semibold',
  HeadingXl: 'semibold',
  HeadingXxl: 'bold',
  HeadingTV: 'bold',
};
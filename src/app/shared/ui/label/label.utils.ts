import { FontWeightType, TypographyType } from '@styles/types/typography';

/** Clase Tailwind por `font-weight` del design system. */
export const FONT_WEIGHT_CLASS: Record<FontWeightType, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

/** Clase Tailwind `text-*` por `font-size` del design system (en px). */
export const FONT_SIZE_CLASS: Record<TypographyType, string> = {
  bodyXxs: 'text-xs',
  bodyXs: 'text-sm',
  bodyS: 'text-sm',
  HeadingXs: 'text-xs',
  HeadingS: 'text-sm',
  HeadingM: 'text-base',
  HeadingL: 'text-lg',
  HeadingXl: 'text-xl',
  HeadingXxl: 'text-2xl',
  HeadingTV: 'text-3xl',
};

/** Clase Tailwind `leading-*` por `line-height` del design system (en px). */
export const LINE_HEIGHT_CLASS: Record<TypographyType, string> = {
  bodyXxs: 'leading-[18px]',
  bodyXs: 'leading-5',
  bodyS: 'leading-5',
  HeadingXs: 'leading-[18px]',
  HeadingS: 'leading-5',
  HeadingM: 'leading-6',
  HeadingL: 'leading-7',
  HeadingXl: 'leading-[30px]',
  HeadingXxl: 'leading-8',
  HeadingTV: 'leading-[38px]',
};

/** Clase Tailwind `line-clamp-N` para los valores soportados (1–6). */
export const LINE_CLAMP_CLASS: Record<number, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
};

/** Clase Tailwind por valor de `text-align`. */
export const ALIGN_CLASS: Record<'left' | 'right' | 'center' | 'justify', string> =
  {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
    justify: 'text-justify',
  };

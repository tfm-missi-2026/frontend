import { FontWeightType } from '@styles/types/typography';

/** Clase Tailwind por `font-weight` del design system. */
export const FONT_WEIGHT_CLASS: Record<FontWeightType, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
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

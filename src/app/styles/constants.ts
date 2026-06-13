import {
  TYPOGRAPHY_FONT_SIZE,
  TYPOGRAPHY_LINE_HEIGHT,
  TYPOGRAPHY_FONT_WEIGHT,
  TYPOGRAPHY_DEFAULT_WEIGHT,
  FontWeightType,
  TypographyType,
} from './types/typography';
import { COLORS, ColorType } from './types/colors';

/**
 * Constantes del design system.
 * Réplica del objeto `designConstants` del proyecto React.
 */
const designConstants = {
  typography: {
    fontSize: TYPOGRAPHY_FONT_SIZE,
    lineHeight: TYPOGRAPHY_LINE_HEIGHT,
    fontWeight: TYPOGRAPHY_FONT_WEIGHT,
    fontWeightByTypographyType: TYPOGRAPHY_DEFAULT_WEIGHT,
  },
  colors: COLORS,
};

export type { FontWeightType, TypographyType, ColorType };
export default designConstants;

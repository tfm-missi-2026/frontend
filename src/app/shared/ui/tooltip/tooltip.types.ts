/** Variante visual del tooltip. */
export type TooltipVariantType =
  | 'light'
  | 'dark'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

/** Lado del trigger donde aparece el tooltip. */
export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

/** Alineación del tooltip respecto al trigger. */
export type TooltipAlign = 'start' | 'center' | 'end';

/**
 * Props base del Tooltip.
 * Sirve principalmente para `satisfies TooltipBaseProps` desde stories
 * y como contrato documentado de la API pública.
 */
export interface TooltipBaseProps {
  variant?: TooltipVariantType;
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  delayDuration?: number;
  closeDelay?: number;
  className?: string;
}

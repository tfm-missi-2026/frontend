import { ConnectedPosition } from '@angular/cdk/overlay';

import { TooltipAlign, TooltipSide } from './tooltip.types';

/**
 * Orden de prioridad al auto-posicionar: el primero que tenga espacio
 * suficiente es elegido por CDK Overlay. Si `autoPosition` es `false`,
 * se respeta solo el `side` preferido.
 */
export const SIDE_PRIORITY: TooltipSide[] = ['top', 'right', 'bottom', 'left'];

const ALIGN_X = (align: TooltipAlign): 'start' | 'center' | 'end' =>
  align === 'start' ? 'start' : align === 'end' ? 'end' : 'center';

const ALIGN_Y = (align: TooltipAlign): 'top' | 'center' | 'bottom' =>
  align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';

/**
 * Genera la `ConnectedPosition` para un `side` + `align` + `offset`
 * dados, mapeando el sistema de coordenadas de CDK Overlay
 * (`originX/Y` + `overlayX/Y`).
 */
export function sideToPosition(
  side: TooltipSide,
  align: TooltipAlign,
  offset: number,
): ConnectedPosition {
  switch (side) {
    case 'top':
      return {
        originX: ALIGN_X(align),
        originY: 'top',
        overlayX: ALIGN_X(align),
        overlayY: 'bottom',
        offsetY: -offset,
      };
    case 'bottom':
      return {
        originX: ALIGN_X(align),
        originY: 'bottom',
        overlayX: ALIGN_X(align),
        overlayY: 'top',
        offsetY: offset,
      };
    case 'left':
      return {
        originX: 'start',
        originY: ALIGN_Y(align),
        overlayX: 'end',
        overlayY: ALIGN_Y(align),
        offsetX: -offset,
      };
    case 'right':
      return {
        originX: 'end',
        originY: ALIGN_Y(align),
        overlayX: 'start',
        overlayY: ALIGN_Y(align),
        offsetX: offset,
      };
  }
}

/**
 * Devuelve la lista ordenada de `ConnectedPosition` para el tooltip.
 * Cuando `autoPosition` es `true`, el `side` preferido va primero y
 * el resto le siguen en orden de `SIDE_PRIORITY` (CDK Overlay hace
 * flip automático al primero que quepa en el viewport).
 */
export function buildPositions(
  side: TooltipSide,
  align: TooltipAlign,
  offset: number,
  autoPosition: boolean,
): ConnectedPosition[] {
  const order: TooltipSide[] = autoPosition
    ? [side, ...SIDE_PRIORITY.filter((s) => s !== side)]
    : [side];
  return order.map((s) => sideToPosition(s, align, offset));
}

let nextTooltipId = 0;

/**
 * Genera un id único y estable por instancia de tooltip. Se usa como
 * valor de `aria-describedby` y como id del panel del overlay.
 */
export function nextTooltipDomId(): string {
  nextTooltipId += 1;
  return `ui-tooltip-${nextTooltipId}`;
}
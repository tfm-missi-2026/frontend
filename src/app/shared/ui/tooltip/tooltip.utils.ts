import type {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
} from "@angular/cdk/overlay";

import { TooltipAlign, TooltipSide, TooltipVariantType } from "./tooltip.types";

const ALIGN_X = (align: TooltipAlign): "start" | "center" | "end" =>
  align === "start" ? "start" : align === "end" ? "end" : "center";

const ALIGN_Y = (align: TooltipAlign): "top" | "center" | "bottom" =>
  align === "start" ? "top" : align === "end" ? "bottom" : "center";

/**
 * Orden de prioridad al auto-posicionar: el primero que tenga espacio
 * suficiente es elegido por CDK Overlay. Si `autoPosition` es `false`,
 * se respeta solo el `side` preferido.
 */
export const SIDE_PRIORITY: TooltipSide[] = ["top", "right", "bottom", "left"];

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
    case "top":
      return {
        originX: ALIGN_X(align),
        originY: "top",
        overlayX: ALIGN_X(align),
        overlayY: "bottom",
        offsetY: -offset,
      };
    case "bottom":
      return {
        originX: ALIGN_X(align),
        originY: "bottom",
        overlayX: ALIGN_X(align),
        overlayY: "top",
        offsetY: offset,
      };
    case "left":
      return {
        originX: "start",
        originY: ALIGN_Y(align),
        overlayX: "end",
        overlayY: ALIGN_Y(align),
        offsetX: -offset,
      };
    case "right":
      return {
        originX: "end",
        originY: ALIGN_Y(align),
        overlayX: "start",
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

export function createTooltipPositionStrategy(
  overlay: Overlay,
  origin: HTMLElement,
  side: TooltipSide,
  align: TooltipAlign,
  offset: number,
  autoPosition: boolean,
): FlexibleConnectedPositionStrategy {
  return overlay
    .position()
    .flexibleConnectedTo(origin)
    .withPositions(buildPositions(side, align, offset, autoPosition))
    .withFlexibleDimensions(false)
    .withPush(true);
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

/**
 * Clases Tailwind por variante en modo claro del tema.
 */
export const LIGHT_VARIANT_CLASSES: Record<TooltipVariantType, string> = {
  light:
    "bg-white text-gray-800 border border-gray-200 px-3 py-3 text-sm leading-5",
  dark: "bg-gray-900 text-white px-2 py-1 text-xs leading-4.5",
  info:
    "bg-blue-light-50 text-blue-light-900 border border-blue-light-200 " +
    "px-2 py-1 text-xs leading-4.5",
  success:
    "bg-success-50 text-success-900 border border-success-200 " +
    "px-2 py-1 text-xs leading-4.5",
  warning:
    "bg-warning-50 text-warning-900 border border-warning-200 " +
    "px-2 py-1 text-xs leading-4.5",
  error:
    "bg-error-50 text-error-900 border border-error-200 " +
    "px-2 py-1 text-xs leading-4.5",
};

/**
 * Clases Tailwind por variante en modo oscuro del tema. Se invierten
 * fondo y texto para mantener el contraste.
 */
export const DARK_VARIANT_CLASSES: Record<TooltipVariantType, string> = {
  light:
    "bg-gray-800 text-gray-100 border border-gray-700 " +
    "px-3 py-3 text-sm leading-5",
  dark: "bg-gray-900 text-white px-2 py-1 text-xs leading-4.5",
  info:
    "bg-blue-light-900/30 text-blue-light-100 border border-blue-light-800 " +
    "px-2 py-1 text-xs leading-4.5",
  success:
    "bg-success-900/30 text-success-100 border border-success-800 " +
    "px-2 py-1 text-xs leading-4.5",
  warning:
    "bg-warning-900/30 text-warning-100 border border-warning-800 " +
    "px-2 py-1 text-xs leading-4.5",
  error:
    "bg-error-900/30 text-error-100 border border-error-800 " +
    "px-2 py-1 text-xs leading-4.5",
};

/**
 * Clases de `translate-*` para la animación direccional por lado.
 * `from` se aplica cuando el tooltip está cerrado y `to` cuando está abierto.
 */
export const SIDE_TRANSLATE_CLASSES: Record<
  TooltipSide,
  { from: string; to: string }
> = {
  top: { from: "-translate-y-1", to: "translate-y-0" },
  bottom: { from: "translate-y-1", to: "translate-y-0" },
  left: { from: "-translate-x-1", to: "translate-x-0" },
  right: { from: "translate-x-1", to: "translate-x-0" },
};

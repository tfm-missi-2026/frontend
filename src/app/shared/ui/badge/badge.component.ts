import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  Type,
} from "@angular/core";
import { NgComponentOutlet } from "@angular/common";

import { IconProps } from "@shared/icons/icon.interface";
import { BadgeColor, BadgeSize, BadgeVariant } from "./badge.types";

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: "px-2.5 py-0.5 text-theme-xs",
  md: "px-3 py-1 text-sm",
};

const COLOR_CLASSES: Record<BadgeVariant, Record<BadgeColor, string>> = {
  light: {
    primary:
      "bg-brand-50 text-brand-500 ring-1 ring-inset ring-brand-500/20 dark:bg-brand-500/15 dark:text-brand-400 dark:ring-brand-500/30",
    success:
      "bg-success-50 text-success-600 ring-1 ring-inset ring-success-500/20 dark:bg-success-500/15 dark:text-success-500 dark:ring-success-500/30",
    error:
      "bg-error-50 text-error-600 ring-1 ring-inset ring-error-500/20 dark:bg-error-500/15 dark:text-error-500 dark:ring-error-500/30",
    warning:
      "bg-warning-50 text-warning-600 ring-1 ring-inset ring-warning-500/20 dark:bg-warning-500/15 dark:text-warning-500 dark:ring-warning-500/30",
    info: "bg-blue-light-50 text-blue-light-500 ring-1 ring-inset ring-blue-light-500/20 dark:bg-blue-light-500/15 dark:text-blue-light-500 dark:ring-blue-light-500/30",
    light: "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-white/5 dark:text-white/80 dark:ring-white/10",
    dark: "bg-gray-500 text-white ring-1 ring-inset ring-gray-500/30 dark:bg-white/5 dark:text-white dark:ring-white/10",
  },
  solid: {
    primary: "bg-brand-500 text-white shadow-sm dark:text-white",
    success: "bg-success-500 text-white shadow-sm dark:text-white",
    error: "bg-error-500 text-white shadow-sm dark:text-white",
    warning: "bg-warning-500 text-white shadow-sm dark:text-white",
    info: "bg-blue-light-500 text-white shadow-sm dark:text-white",
    light: "bg-gray-400 text-white shadow-sm dark:bg-white/5 dark:text-white/80",
    dark: "bg-gray-700 text-white shadow-sm dark:text-white",
  },
};

const BASE_STYLES =
  "inline-flex items-center justify-center gap-1 rounded-full font-medium leading-none whitespace-nowrap transition-colors";

/**
 * `UiBadge`
 * --------
 * Etiqueta compacta con icono opcional a izquierda o derecha, usada
 * para resaltar estado, categoría o contador.
 *
 * Variantes: `light` | `solid` (default `light`).
 * Tamaños: `sm` | `md` (default `md`).
 * Colores: `primary` | `success` | `error` | `warning` | `info` | `light` | `dark` (default `primary`).
 *
 * `startIcon` y `endIcon` aceptan un **componente Angular** (`Type<unknown>`)
 * del design system que se renderiza vía `NgComponentOutlet`. Esto
 * mantiene la convención del DS (todos los iconos viven en
 * `@shared/icons`) y se alinea con el patrón usado por `UiButton`.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiBadge",
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="containerClasses()">
      @if (startIcon()) {
        <ng-container
          *ngComponentOutlet="startIcon() ?? null; inputs: iconInputs()"
        ></ng-container>
      }
      <ng-content></ng-content>
      @if (endIcon()) {
        <ng-container
          *ngComponentOutlet="endIcon() ?? null; inputs: iconInputs()"
        ></ng-container>
      }
    </span>
  `,
})
export class UiBadgeComponent {
  /** Variante visual: fondo claro o color sólido. */
  readonly variant = input<BadgeVariant>("light");
  /** Tamaño tipográfico. */
  readonly size = input<BadgeSize>("md");
  /** Color semántico. */
  readonly color = input<BadgeColor>("primary");

  /** Componente Angular opcional a la izquierda del texto. */
  readonly startIcon = input<Type<unknown> | undefined>(undefined);
  /** Componente Angular opcional a la derecha del texto. */
  readonly endIcon = input<Type<unknown> | undefined>(undefined);

  /** Props para los íconos (size default 12). */
  readonly iconProps = input<IconProps>({});

  readonly sizeClass = computed<string>(() => SIZE_CLASSES[this.size()]);

  readonly colorClass = computed<string>(
    () => COLOR_CLASSES[this.variant()][this.color()],
  );

  readonly containerClasses = computed<string>(
    () => `${BASE_STYLES} ${this.sizeClass()} ${this.colorClass()}`,
  );

  readonly iconInputs = computed<Record<string, unknown>>(() => {
    const props: Record<string, unknown> = { ...this.iconProps() };
    if (props["size"] === undefined) {
      props["size"] = 12;
    }
    return props;
  });
}
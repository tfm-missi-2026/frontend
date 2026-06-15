import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { inject } from "@angular/core";

import { BadgeColor, BadgeSize, BadgeVariant } from "./badge.types";

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: "text-theme-xs",
  md: "text-sm",
};

const COLOR_CLASSES: Record<BadgeVariant, Record<BadgeColor, string>> = {
  light: {
    primary:
      "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400",
    success:
      "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
    error:
      "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500",
    warning:
      "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400",
    info: "bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500",
    light: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80",
    dark: "bg-gray-500 text-white dark:bg-white/5 dark:text-white",
  },
  solid: {
    primary: "bg-brand-500 text-white dark:text-white",
    success: "bg-success-500 text-white dark:text-white",
    error: "bg-error-500 text-white dark:text-white",
    warning: "bg-warning-500 text-white dark:text-white",
    info: "bg-blue-light-500 text-white dark:text-white",
    light: "bg-gray-400 text-white dark:bg-white/5 dark:text-white/80",
    dark: "bg-gray-700 text-white dark:text-white",
  },
};

const BASE_STYLES =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium";

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
 * `startIcon` y `endIcon` aceptan un string de SVG/HTML que se renderiza
 * vía `[innerHTML]` después de pasar por el `DomSanitizer` (bypass de
 * seguridad). Mantener el control sobre el contenido inyectado.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiBadge",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="containerClasses()">
      @if (startIcon()) {
        <span class="mr-1" [innerHTML]="safeStartIcon()"></span>
      }
      <ng-content></ng-content>
      @if (endIcon()) {
        <span class="ml-1" [innerHTML]="safeEndIcon()"></span>
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
  /** SVG/HTML opcional a la izquierda del texto. */
  readonly startIcon = input<string | undefined>(undefined);
  /** SVG/HTML opcional a la derecha del texto. */
  readonly endIcon = input<string | undefined>(undefined);

  private readonly sanitizer = inject(DomSanitizer);

  readonly sizeClass = computed<string>(() => SIZE_CLASSES[this.size()]);

  readonly colorClass = computed<string>(
    () => COLOR_CLASSES[this.variant()][this.color()],
  );

  readonly containerClasses = computed<string>(
    () => `${BASE_STYLES} ${this.sizeClass()} ${this.colorClass()}`,
  );

  readonly safeStartIcon = computed<SafeHtml | string>(() =>
    this.startIcon()
      ? this.sanitizer.bypassSecurityTrustHtml(this.startIcon()!)
      : "",
  );

  readonly safeEndIcon = computed<SafeHtml | string>(() =>
    this.endIcon()
      ? this.sanitizer.bypassSecurityTrustHtml(this.endIcon()!)
      : "",
  );
}

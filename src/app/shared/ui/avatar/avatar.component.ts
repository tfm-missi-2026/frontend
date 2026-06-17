import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { AvatarSize, AvatarStatus } from "./avatar.types";

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xsmall: "h-6 w-6 max-w-6",
  small: "h-8 w-8 max-w-8",
  medium: "h-10 w-10 max-w-10",
  large: "h-12 w-12 max-w-12",
  xlarge: "h-14 w-14 max-w-14",
  xxlarge: "h-16 w-16 max-w-16",
};

const STATUS_SIZE_CLASSES: Record<AvatarSize, string> = {
  xsmall: "h-1.5 w-1.5 max-w-1.5",
  small: "h-2 w-2 max-w-2",
  medium: "h-2.5 w-2.5 max-w-2.5",
  large: "h-3 w-3 max-w-3",
  xlarge: "h-3.5 w-3.5 max-w-3.5",
  xxlarge: "h-4 w-4 max-w-4",
};

const STATUS_COLOR_CLASSES: Record<Exclude<AvatarStatus, "none">, string> = {
  online: "bg-success-500",
  offline: "bg-error-400",
  busy: "bg-warning-500",
};

/**
 * `UiAvatar`
 * Imagen de avatar circular con un punto de estado opcional.
 *
 * Variantes de tamaño: `xsmall` | `small` | `medium` | `large` | `xlarge` | `xxlarge`.
 * Estados de presencia: `online` | `offline` | `busy` | `none` (default `none` = oculto).
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiAvatar",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative rounded-full" [class]="sizeClasses()">
      <img [src]="src()" [alt]="alt()" class="object-cover rounded-full" />

      @if (status() !== "none") {
        <span
          class="absolute bottom-0 right-0 rounded-full border-[1.5px] border-white dark:border-gray-900"
          [class]="statusDotClasses()"
        ></span>
      }
    </div>
  `,
})
export class UiAvatarComponent {
  /** URL de la imagen del avatar. */
  readonly src = input.required<string>();
  /** Texto alternativo para la imagen. */
  readonly alt = input<string>("User Avatar");
  /** Tamaño del avatar. Default `'medium'`. */
  readonly size = input<AvatarSize>("medium");
  /** Estado de presencia. `'none'` oculta el indicador. */
  readonly status = input<AvatarStatus>("none");

  readonly sizeClasses = computed<string>(() => SIZE_CLASSES[this.size()]);
  readonly statusDotClasses = computed<string>(
    () =>
      `${STATUS_SIZE_CLASSES[this.size()]} ${STATUS_COLOR_CLASSES[this.status() as Exclude<AvatarStatus, "none">] ?? ""}`,
  );
}

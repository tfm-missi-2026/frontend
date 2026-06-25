import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { AvatarSize, AvatarStatus } from "./avatar.types";
import {
  AVATAR_SIZE_CLASSES,
  AVATAR_STATUS_COLOR_CLASSES,
  AVATAR_STATUS_SIZE_CLASSES,
} from "./avatar.variants";

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

  readonly sizeClasses = computed<string>(
    () => AVATAR_SIZE_CLASSES[this.size()],
  );
  readonly statusDotClasses = computed<string>(() => {
    const status = this.status();
    if (status === "none") return "";
    return [
      AVATAR_STATUS_SIZE_CLASSES[this.size()],
      AVATAR_STATUS_COLOR_CLASSES[status],
    ].join(" ");
  });
}

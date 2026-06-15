import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  input,
  output,
  PLATFORM_ID,
  inject,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

import { IconXComponent } from "@shared/ui/icon";

/**
 * `UiModal`
 * --------
 * Modal genérico con backdrop, escape, content projection y botón
 * de cierre opcional. Standalone + OnPush + signal APIs.
 *
 * Características:
 * - Se renderiza solo cuando `isOpen` es `true`.
 * - Si `isFullscreen` es `true`, ocupa toda la pantalla y no tiene
 *   backdrop (no cierra al click fuera).
 * - `showCloseButton` renderiza la X en la esquina superior derecha.
 * - Cierra al pulsar `Escape` o al hacer click en el backdrop.
 * - Maneja `document.body.style.overflow` cuando se abre/cierra.
 */
@Component({
  selector: "UiModal",
  standalone: true,
  imports: [IconXComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999"
      >
        @if (!isFullscreen()) {
          <div
            class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
            (click)="onBackdropClick($event)"
          ></div>
        }
        <div [class]="contentClasses()" (click)="onContentClick($event)">
          @if (showCloseButton()) {
            <button
              type="button"
              (click)="close.emit()"
              class="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
            >
              <IconX
                [size]="24"
                color="currentColor"
                [style]="{ 'stroke-width': '2' }"
              />
            </button>
          }
          <div>
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
})
export class UiModalComponent {
  /** Estado de visibilidad del modal. */
  readonly isOpen = input<boolean>(false);
  /** Clases extra aplicadas al contenedor del contenido. */
  readonly className = input<string>("");
  /** Renderiza el botón de cerrar en la esquina. */
  readonly showCloseButton = input<boolean>(true);
  /** Modal a pantalla completa (sin backdrop, ocupa el viewport). */
  readonly isFullscreen = input<boolean>(false);

  readonly close = output<void>();

  readonly contentClasses = computed<string>(() => {
    const base = this.isFullscreen()
      ? "w-full h-full"
      : "relative w-full rounded-3xl bg-white dark:bg-gray-900";
    const extra = this.className();
    return extra ? `${base} ${extra}` : base;
  });

  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      document.body.style.overflow = this.isOpen() ? "hidden" : "";
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (!this.isFullscreen()) {
      this.close.emit();
    }
  }

  onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (this.isOpen()) {
      this.close.emit();
    }
  }
}

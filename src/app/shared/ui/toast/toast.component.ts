import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
  Type,
} from '@angular/core';

import {
  IconAlertErrorComponent,
  IconAlertInfoComponent,
  IconAlertSuccessComponent,
  IconAlertWarningComponent,
  IconCloseLargeComponent,
} from '@shared/icons';
import { IconVariant } from '@shared/ui/icon/icon.utils';
import { UiFlexComponent } from '@shared/ui/flex/flex.component';
import { UiIconComponent } from '@shared/ui/icon/icon.component';
import { UiLabelComponent } from '@shared/ui/label/label.component';
import { UiSurfaceComponent } from '@shared/ui/surface/surface.component';

import { ToastPosition, ToastVariant } from './toast.types';
import { TOAST_POSITION_CLASSES, TOAST_SURFACE_VARIANT } from './toast.utils';

/**
 * Mapa de variante → componente icono del design system.
 * Resuelve la dependencia de icono sin pasar por `UiAlert`.
 */
const TOAST_ICON: Record<ToastVariant, Type<unknown>> = {
  error: IconAlertErrorComponent,
  success: IconAlertSuccessComponent,
  warning: IconAlertWarningComponent,
  info: IconAlertInfoComponent,
};

/**
 * Mapa de variante → `IconVariant` (semántico del color del icono).
 */
const TOAST_ICON_VARIANT: Record<ToastVariant, IconVariant> = {
  error: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info',
};

/**
 * `UiToast`
 * --------
 * Notificación flotante del design system. Independiente de
 * `UiAlert`: se compone internamente con `UiSurface` + `UiIcon` +
 * `UiFlex` + `UiLabel`, todos primitivos del design system.
 *
 * Diferencias con `UiAlert`:
 *  - Posición fija en viewport (no desplaza contenido del layout).
 *  - Cierre manual vía × (configurable).
 *  - Auto-dismiss vía `durationSeconds` (default 5s).
 *  - z-index alto para superponerse a otros elementos.
 *  - Animación de entrada/salida.
 *
 * API signal-based (Angular 17.1+).
 *
 * @example
 * ```html
 * @if (errorMessage(); as msg) {
 *   <UiToast
 *     variant="error"
 *     [message]="msg"
 *     [durationSeconds]="5"
 *     (dismissed)="errorMessage.set(null)"
 *   />
 * }
 * ```
 */
@Component({
  selector: 'UiToast',
  standalone: true,
  imports: [
    NgComponentOutlet,
    UiSurfaceComponent,
    UiFlexComponent,
    UiIconComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.component.html',
})
export class UiToastComponent {
  /** Variante semántica. Define color de fondo, borde e icono. */
  readonly variant = input<ToastVariant>('info');
  /** Mensaje principal del toast. */
  readonly message = input<string>('');
  /** Título opcional (en negrita arriba del mensaje). */
  readonly title = input<string>('');
  /** Posición fija en viewport. Default: `top-right`. */
  readonly position = input<ToastPosition>('top-right');
  /** Muestra el botón de cerrar (×). Default: `true`. */
  readonly showCloseButton = input<boolean>(true);
  /**
   * Duración del toast en pantalla, en **segundos**. Si se define y
   * es mayor a 0, el toast se cierra automáticamente y emite
   * `dismissed` al cumplirse. Default: `5`. Para desactivar el
   * auto-dismiss, pasar `0` (o un número negativo).
   */
  readonly durationSeconds = input<number>(5);
  /** Clases extra aplicadas al contenedor exterior. */
  readonly className = input<string>('');

  /** Emite cuando el toast se cierra (manual o auto-dismiss). */
  readonly dismissed = output<void>();

  /** Estado interno de visibilidad. Controlado por `dismiss()`. */
  private readonly _visible = signal<boolean>(true);

  private readonly destroyRef = inject(DestroyRef);
  private timerId?: ReturnType<typeof setTimeout>;

  readonly visible = computed<boolean>(() => this._visible());

  readonly surfaceVariant = computed(() => TOAST_SURFACE_VARIANT[this.variant()]);
  readonly iconComponent = computed<Type<unknown>>(() => TOAST_ICON[this.variant()]);
  readonly iconVariant = computed<IconVariant>(() => TOAST_ICON_VARIANT[this.variant()]);

  /** Duración en milisegundos derivada de `durationSeconds`. */
  private readonly durationMs = computed<number | undefined>(() => {
    const s = this.durationSeconds();
    return s > 0 ? s * 1000 : undefined;
  });

  readonly containerClasses = computed<string>(() =>
    [
      'fixed z-50 max-w-sm w-full sm:w-auto',
      'animate-[toast-in_0.2s_ease-out]',
      TOAST_POSITION_CLASSES[this.position()],
      this.className(),
    ]
      .filter(Boolean)
      .join(' '),
  );

  /** Icono del botón × de cierre. */
  readonly closeIcon: Type<unknown> = IconCloseLargeComponent;

  readonly contentClasses = computed<string>(() => 'flex items-start gap-3 pr-8');

  readonly closeButtonClasses = computed<string>(
    () =>
      'absolute top-2 right-2 inline-flex items-center justify-center size-6 rounded-md opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/40 transition-opacity',
  );

  constructor() {
    // Auto-dismiss: arma un timer cuando hay `durationMs` y el toast
    // está visible. El `effect` se re-evalúa si cambia
    // `durationSeconds` o la visibilidad; el cleanup se hace en
    // `destroyRef`.
    effect(() => {
      const ms = this.durationMs();
      const isVisible = this._visible();

      if (this.timerId !== undefined) {
        clearTimeout(this.timerId);
        this.timerId = undefined;
      }

      if (ms !== undefined && isVisible) {
        this.timerId = setTimeout(() => this.dismiss(), ms);
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.timerId !== undefined) {
        clearTimeout(this.timerId);
        this.timerId = undefined;
      }
    });
  }

  /** Cierra el toast (programático o desde la UI). */
  dismiss(): void {
    if (!this._visible()) return;
    this._visible.set(false);
    this.dismissed.emit();
  }

  onCloseClick(event: MouseEvent): void {
    event.stopPropagation();
    this.dismiss();
  }
}
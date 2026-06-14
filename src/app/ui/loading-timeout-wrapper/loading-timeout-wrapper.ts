import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { ButtonStyleType, ButtonVariant } from '@ui/button/types';
import { getVariantClasses } from '@ui/button/variants';

/**
 * `UiLoadingTimeoutWrapper`
 * -------------------------
 * Contenedor presentacional que envuelve un `UiButton` (o `UiIconButton`)
 * cuando está en estado `isLoading` o `runningTimeout`.
 *
 * Responsabilidades:
 *  1. Aportar el marco visual (background, border, color) que el botón
 *     interior "cede" (queda borderless) para que la progress bar pueda
 *     ser recortada por el `border-radius` del wrapper.
 *  2. Pintar una progress bar animada de 0 → 100% sobre `timeout` ms.
 *  3. Respetar `fullWidth` para que el wrapper ocupe el contenedor padre.
 */
@Component({
  selector: 'UiLoadingTimeoutWrapper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()" data-testid="loading-timeout-wrapper">
      @if (timeout()) {
        <div
          class="loading-timeout-wrapper__progress"
          [style]="progressStyle()"
          aria-hidden="true"
        ></div>
      }
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./loading-timeout-wrapper.css'],
})
export class UiLoadingTimeoutWrapperComponent {
  /** Variante visual. */
  readonly variant = input<ButtonVariant>('primary');
  /** Estilo semántico. */
  readonly styleType = input<ButtonStyleType>('default');
  /** Si `true`, el wrapper ocupa el 100% del ancho del contenedor. */
  readonly fullWidth = input<boolean>(false);
  /** Si `true`, el fondo es transparente. */
  readonly transparent = input<boolean>(false);
  /** Duración de la progress bar (ms). Si es 0/undefined, no se anima. */
  readonly timeout = input<number | undefined>(undefined);
  /** Clases extra para el contenedor. */
  readonly className = input<string>('');

  /** Clases del contenedor. */
  readonly containerClasses = computed<string>(() =>
    [
      getVariantClasses(this.variant(), this.styleType(), this.transparent()),
      this.fullWidth() ? 'w-full' : 'inline-flex',
      'relative overflow-hidden',
      'border border-solid',
      'rounded-lg',
      'cursor-pointer select-none',
      this.className(),
    ]
      .filter(Boolean)
      .join(' '),
  );

  /**
   * Estilo en línea que pasa la duración al CSS de la progress bar
   * vía variable CSS (Tailwind no tiene una utility para esto).
   */
  readonly progressStyle = computed<Record<string, string>>(() => {
    if (this.timeout()) {
      return { animationDuration: `${this.timeout()}ms` };
    }
    return { display: 'none' };
  });
}

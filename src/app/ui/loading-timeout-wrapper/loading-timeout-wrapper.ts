import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

import { ButtonStyleType, ButtonVariant } from '@ui/button/types';
import { getVariantClasses } from '@ui/button/variants';

/**
 * `LoadingTimeoutWrapper`
 * -----------------------
 * Contenedor presentacional que envuelve un `Button` (o `IconButton`)
 * cuando está en estado `isLoading` o `runningTimeout`.
 *
 * Responsabilidades:
 *  1. Aportar el marco visual (background, border, color) que el botón
 *     interior "cede" (queda borderless) para que la progress bar pueda
 *     ser recortada por el `border-radius` del wrapper.
 *  2. Pintar una progress bar animada de 0 → 100% sobre `timeout` ms.
 *  3. Respetar `fullWidth` para que el wrapper ocupe el contenedor padre.
 *
 * Réplica Angular del `LoadingTimeoutWrapper` del proyecto React.
 */
@Component({
  selector: 'LoadingTimeoutWrapper',
  standalone: true,
  imports: [NgClass, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loading-timeout-wrapper.html',
  styleUrls: ['./loading-timeout-wrapper.css'],
})
export class LoadingTimeoutWrapperComponent {
  /** Variante visual. */
  @Input() variant: ButtonVariant = 'primary';

  /** Estilo semántico. */
  @Input() styleType: ButtonStyleType = 'default';

  /** Si `true`, el wrapper ocupa el 100% del ancho del contenedor. */
  @Input() fullWidth = false;

  /** Si `true`, el fondo es transparente. */
  @Input() transparent = false;

  /** Duración de la progress bar (ms). Si es 0/undefined, no se anima. */
  @Input() timeout?: number;

  /** Clases extra para el contenedor. */
  @Input() className = '';

  get containerClasses(): string {
    return [
      getVariantClasses(this.variant, this.styleType, this.transparent),
      this.fullWidth ? 'w-full' : 'inline-flex',
      'relative overflow-hidden',
      'border border-solid',
      'rounded-lg',
      'cursor-pointer select-none',
      this.className,
    ]
      .filter(Boolean)
      .join(' ');
  }

  /**
   * Estilo en línea que pasa la duración al CSS de la progress bar
   * vía variable CSS (Tailwind no tiene una utility para esto).
   */
  get progressStyle(): Record<string, string> {
    return this.timeout
      ? { animationDuration: `${this.timeout}ms` }
      : { display: 'none' };
  }
}

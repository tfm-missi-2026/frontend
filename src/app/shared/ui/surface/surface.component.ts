import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  SURFACE_BASE_CLASSES,
  SURFACE_PADDING_CLASSES,
  SURFACE_VARIANT_CLASSES,
} from './surface.variants';
import { SurfacePadding, SurfaceVariant } from './surface.types';

/**
 * `UiSurface`
 * ----------
 * Contenedor genérico del design system con `border` + `radius` +
 * `padding` + variante semántica (`success` | `error` | `warning` |
 * `info` | `neutral`). Reacciona al cambio de tema y reemplaza el
 * anti-patrón de `<div>` con clases de layout hardcoded.
 *
 * Es la base visual sobre la que se construyen banners, notices,
 * callouts y alertas. Cualquier consumidor que necesite un
 * contenedor con borde + fondo semántico debe usar este primitivo
 * en lugar de declarar un `<div>` propio.
 *
 * API signal-based (Angular 17.1+).
 *
 * @example
 * ```html
 * <UiSurface variant="info" padding="md" data-testid="my-banner">
 *   Contenido del banner.
 * </UiSurface>
 * ```
 */
@Component({
  selector: 'UiSurface',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()" [attr.data-testid]="dataTestId() || null">
      <ng-content></ng-content>
    </div>
  `,
})
export class UiSurfaceComponent {
  /** Variante semántica. Define borde y fondo. Default: `neutral`. */
  readonly variant = input<SurfaceVariant>('neutral');
  /** Padding interno. Default: `md`. */
  readonly padding = input<SurfacePadding>('md');
  /** Clases extra aplicadas al contenedor. */
  readonly className = input<string>('');
  /** `data-testid` para queries en tests E2E/unit. */
  readonly dataTestId = input<string | undefined>(undefined);

  /** Clases combinadas del contenedor. */
  readonly containerClasses = computed<string>(() =>
    [
      SURFACE_BASE_CLASSES,
      SURFACE_VARIANT_CLASSES[this.variant()],
      SURFACE_PADDING_CLASSES[this.padding()],
      this.className(),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

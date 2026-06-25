import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

import { UiCardComponent } from '@shared/ui/card';

/**
 * `CommonComponentCard`
 * ---------------------
 * Wrapper del namespace `common/` sobre `UiCard` del design system.
 *
 * Pensado para secciones "showcase" de las páginas UI Elements
 * (botones, badges, alerts, etc.), donde cada variante vive en su
 * propia tarjeta con título fijo arriba. Mantiene la API previa
 * (`title`, `desc`, `className`) para no tocar los consumidores;
 * delega el rendering y la accesibilidad a `UiCard`.
 *
 * API signal-based (Angular 17.1+).
 *
 * @example
 * ```html
 * <CommonComponentCard title="Primary Button">
 *   <UiButton variant="primary" label="Click me" />
 * </CommonComponentCard>
 * ```
 */
@Component({
  selector: 'CommonComponentCard',
  standalone: true,
  imports: [UiCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiCard
      [title]="title()"
      [description]="desc()"
      [divider]="true"
      [className]="className()"
    >
      <ng-content></ng-content>
    </UiCard>
  `,
})
export class CommonComponentCardComponent {
  /** Título visible en la cabecera de la tarjeta. */
  readonly title = input<string>('');
  /** Descripción opcional debajo del título. */
  readonly desc = input<string>('');
  /** Clases extra aplicadas al contenedor. */
  readonly className = input<string>('');
}

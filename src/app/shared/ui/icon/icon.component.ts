import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { ICON_VARIANT_CLASSES, IconVariant } from './icon.variants';

/**
 * `UiIcon`
 * -------
 * Slot visual del icono en primitivos del design system que lo
 * requieran (alertas, notices, toasts). Aplica el color semántico
 * correspondiente y limita el contenedor a un cuadrado del tamaño
 * pedido para que el icono no se expanda al ancho disponible.
 *
 * Usa `currentColor` en el slot para que el consumidor pase el
 * componente icono vía `*ngComponentOutlet` y herede el color.
 *
 * API signal-based (Angular 17.1+).
 *
 * @example
 * ```html
 * <UiIcon variant="warning">
 *   <ng-container *ngComponentOutlet="IconWarning; inputs: { size: 24 }" />
 * </UiIcon>
 * ```
 */
@Component({
  selector: 'UiIcon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="containerClasses()" [attr.data-testid]="dataTestId() || null">
      <ng-content></ng-content>
    </span>
  `,
})
export class UiIconComponent {
  /** Variante semántica. Define el color del icono. Default: `neutral`. */
  readonly variant = input<IconVariant>('neutral');
  /** Tamaño del contenedor en px (ancho y alto). Default: `24`. */
  readonly size = input<number>(24);
  /** Clases extra aplicadas al contenedor. */
  readonly className = input<string>('');
  /** `data-testid` para queries en tests E2E/unit. */
  readonly dataTestId = input<string | undefined>(undefined);

  /** Clases combinadas del contenedor (color semántico + tamaño + extras). */
  readonly containerClasses = computed<string>(() => {
    const sizePx = this.size();
    return [
      'inline-flex shrink-0 items-center justify-center',
      ICON_VARIANT_CLASSES[this.variant()],
      this.className(),
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
  });
}

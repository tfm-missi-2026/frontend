import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconShoppingCart`
 * ------------------
 * Carrito de compras pequeño (18×18) usado en el item "Checkout
 * Started" del timeline de `OrderHistory`.
 *
 * Usa `stroke="currentColor"`, por lo que se controla con la propiedad
 * `color` o con la clase de color del padre.
 */
@Component({
  selector: 'IconShoppingCart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      [style.color]="color()"
      style="flex-shrink: 0; display: inline-block;"
    >
      <path
        d="M1.73828 3H2.6237C3.18449 3 3.65964 3.41301 3.73774 3.96834L3.85169 4.77871M3.85169 4.77871L4.67828 10.6567C4.75637 11.212 5.23153 11.625 5.79232 11.625L12.8135 11.625C13.2612 11.625 13.6663 11.3595 13.845 10.949L15.8455 6.35267C16.1689 5.60962 15.6243 4.77871 14.814 4.77871H3.85169Z"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.83789 14.625H5.84539M12.2407 14.625H12.2482"
        stroke="currentColor"
        stroke-width="2.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class IconShoppingCartComponent {
  readonly size = input<number | string>(18);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly color = input<string>('currentColor');
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

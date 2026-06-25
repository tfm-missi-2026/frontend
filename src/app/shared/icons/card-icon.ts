import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconCard`
 * ---------
 * Tarjeta de crédito con detalles (chip, número y banda) pequeña
 * (18×18) usada en el item "Purchased" del timeline de `OrderHistory`.
 *
 * Usa `stroke="currentColor"`, por lo que se controla con la propiedad
 * `color` o con la clase de color del padre.
 */
@Component({
  selector: 'IconCard',
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
        d="M2.0625 7.875V12.9375C2.0625 13.5588 2.56618 14.0625 3.1875 14.0625H6.97559M2.0625 7.875V6.75M2.0625 7.875H9.06152C9.06152 7.875 10.3431 6.7552 12.4698 6.75M2.0625 6.75V5.0625C2.0625 4.44118 2.56618 3.9375 3.1875 3.9375H14.8125C15.4338 3.9375 15.9375 4.44118 15.9375 5.0625V6.75M2.0625 6.75H12.4698M15.9375 6.75V7.92188C15.9375 7.92188 14.649 6.75526 12.4995 6.75M15.9375 6.75H12.4995M12.4698 6.75C12.4797 6.74998 12.4896 6.74998 12.4995 6.75M12.4698 6.75H12.4995M13.7812 10.8576C13.7812 10.3139 13.3405 9.87318 12.7968 9.87318H12.2812C11.6599 9.87318 11.1562 10.3769 11.1562 10.9982V11.197C11.1562 11.6659 11.4471 12.0857 11.8862 12.2503L13.0513 12.6873C13.4904 12.852 13.7812 13.2717 13.7812 13.7406V13.9395C13.7812 14.5608 13.2776 15.0645 12.6562 15.0645H12.1407C11.597 15.0645 11.1562 14.6237 11.1562 14.08M12.4688 15.0645V15.9375M12.4688 9V9.87318"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class IconCardComponent {
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

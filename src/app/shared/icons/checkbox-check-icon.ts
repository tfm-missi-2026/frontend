import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconCheckboxCheck`
 * ------------------
 * Checkmark blanco pequeño usado dentro de los checkboxes de las
 * tablas de ecommerce (`TransactionList`, `ProductListTable`).
 *
 * El trazo es siempre blanco porque va sobre un checkbox con fondo
 * brand; no se ve afectado por la propiedad `color`.
 */
@Component({
  selector: 'IconCheckboxCheck',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      style="flex-shrink: 0; display: inline-block;"
    >
      <path
        d="M10 3L4.5 8.5L2 6"
        stroke="white"
        stroke-width="1.6666"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class IconCheckboxCheckComponent {
  readonly size = input<number | string>(12);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

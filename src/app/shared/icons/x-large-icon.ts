import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconXLarge`
 * -----------
 * X de 16×16 usada como bullet de los beneficios NO incluidos en
 * el plan de `BillingPlan` (los que aparecen tachados).
 *
 * Usa `stroke="currentColor"` para los trazos, por lo que se controla
 * con la propiedad `color` o con la clase de color del padre.
 */
@Component({
  selector: 'IconXLarge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      [style.color]="color()"
      style="flex-shrink: 0; display: inline-block;"
    >
      <path
        d="M4.5 11.4992L11.4986 4.50058M4.5 4.50049L11.4986 11.4991"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class IconXLargeComponent {
  readonly size = input<number | string>(16);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly color = input<string>('currentColor');
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

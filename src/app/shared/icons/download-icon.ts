import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconDownload`
 * -------------
 * Icono "descargar" (flecha hacia abajo + bandeja superior) usado en
 * los botones de descarga de invoices (`BillingInvoiceTable`).
 *
 * Usa `stroke="currentColor"` para los trazos, por lo que se controla
 * con la propiedad `color` o con la clase de color del padre.
 */
@Component({
  selector: 'IconDownload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 21 20"
      fill="none"
      aria-hidden="true"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      [style.color]="color()"
      style="flex-shrink: 0; display: inline-block;"
    >
      <path
        d="M17.1661 13.333V15.4163C17.1661 16.1067 16.6064 16.6663 15.9161 16.6663H5.08203C4.39168 16.6663 3.83203 16.1067 3.83203 15.4163V13.333M10.5004 13.333L10.5005 3.33301M6.64456 9.47918L10.4986 13.3308L14.3529 9.47918"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class IconDownloadComponent {
  readonly size = input<number | string>(20);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly color = input<string>('currentColor');
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

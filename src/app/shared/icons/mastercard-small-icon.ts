import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconMastercardSmall`
 * ---------------------
 * Variante de 20×20 del logo de Mastercard usado como prefijo en el
 * campo "Card number" del `DefaultInputs` (Form Elements).
 *
 * A diferencia de `IconMastercard` (33×32, mismo aspecto), esta versión
 * se renderiza con tamaño 20×20 y mantiene los colores oficiales de
 * marca (rojo, amarillo, naranja).
 */
@Component({
  selector: 'IconMastercardSmall',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      style="flex-shrink: 0; display: inline-block;"
    >
      <circle cx="6.25" cy="10" r="5.625" fill="#E80B26"></circle>
      <circle cx="13.75" cy="10" r="5.625" fill="#F59D31"></circle>
      <path
        d="M10 14.1924C11.1508 13.1625 11.875 11.6657 11.875 9.99979C11.875 8.33383 11.1508 6.8371 10 5.80713C8.84918 6.8371 8.125 8.33383 8.125 9.99979C8.125 11.6657 8.84918 13.1625 10 14.1924Z"
        fill="#FC6020"
      />
    </svg>
  `,
})
export class IconMastercardSmallComponent {
  readonly size = input<number | string>(20);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconMastercard`
 * ---------------
 * Logo de Mastercard (dos círculos rojo y amarillo con solapamiento
 * naranja) usado en el listado de métodos de pago (`PaymentMethod`).
 *
 * Los colores son hardcoded (rojo, amarillo, naranja) para mantener
 * la identidad de marca, no se ve afectado por la propiedad `color`.
 */
@Component({
  selector: 'IconMastercard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 33 32"
      fill="none"
      aria-hidden="true"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      style="flex-shrink: 0; display: inline-block;"
    >
      <circle cx="10.5" cy="16" r="9" fill="#E80B26" />
      <circle cx="22.5" cy="16" r="9" fill="#F59D31" />
      <path
        d="M16.5 22.7085C18.3413 21.0605 19.5 18.6658 19.5 16.0002C19.5 13.3347 18.3413 10.9399 16.5 9.29199C14.6587 10.9399 13.5 13.3347 13.5 16.0002C13.5 18.6658 14.6587 21.0605 16.5 22.7085Z"
        fill="#FC6020"
      />
    </svg>
  `,
})
export class IconMastercardComponent {
  readonly size = input<number | string>(32);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

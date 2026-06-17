import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconVisa`
 * ---------
 * Logo de Visa (texto "VISA" estilizado) usado en el listado de
 * métodos de pago (`PaymentMethod`).
 *
 * El color es hardcoded (azul Visa) para mantener la identidad de
 * marca, no se ve afectado por la propiedad `color`.
 */
@Component({
  selector: 'IconVisa',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 33 18"
      fill="none"
      aria-hidden="true"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      style="flex-shrink: 0; display: inline-block;"
    >
      <g clip-path="url(#IconVisaClip)">
        <path
          d="M21.2243 3.90918C18.9651 3.90918 16.9462 5.06569 16.9462 7.20245C16.9462 9.65285 20.5268 9.82209 20.5268 11.0531C20.5268 11.5715 19.9254 12.0355 18.8981 12.0355C17.4403 12.0355 16.3507 11.3871 16.3507 11.3871L15.8844 13.5434C15.8844 13.5434 17.1396 14.091 18.8061 14.091C21.2762 14.091 23.2198 12.8777 23.2198 10.7045C23.2198 8.11511 19.6243 7.95089 19.6243 6.80831C19.6243 6.4022 20.118 5.95732 21.1423 5.95732C22.298 5.95732 23.2409 6.42885 23.2409 6.42885L23.6972 4.34631C23.6972 4.34631 22.6712 3.90918 21.2243 3.90918ZM0.554718 4.06638L0.5 4.38071C0.5 4.38071 1.45047 4.55249 2.3065 4.89522C3.40871 5.28816 3.48725 5.51692 3.67287 6.22747L5.69567 13.9289H8.40731L12.5848 4.06638H9.87935L7.19509 10.7719L6.09978 5.08798C5.99931 4.43747 5.49047 4.06638 4.86767 4.06638H0.554718ZM13.6726 4.06638L11.5503 13.9289H14.1301L16.245 4.06634L13.6726 4.06638ZM28.0612 4.06638C27.4391 4.06638 27.1095 4.39529 26.8676 4.97009L23.088 13.9289H25.7934L26.3168 12.4357H29.6128L29.9311 13.9289H32.3182L30.2357 4.06638H28.0612ZM28.413 6.73093L29.2149 10.4318H27.0665L28.413 6.73093Z"
          fill="#1434CB"
        />
      </g>
      <defs>
        <clipPath id="IconVisaClip">
          <rect
            width="32"
            height="17.4545"
            fill="white"
            transform="translate(0.5 0.272949)"
          />
        </clipPath>
      </defs>
    </svg>
  `,
})
export class IconVisaComponent {
  readonly size = input<number | string>(18);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

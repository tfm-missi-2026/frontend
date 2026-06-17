import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconPdf`
 * --------
 * Icono de archivo PDF (carpeta con etiqueta "PDF") usado en la
 * lista de invoices (`BillingInvoiceTable`).
 *
 * Los colores del archivo son hardcoded (grises + rojo PDF + letras
 * blancas) para mantener la identidad visual del formato, no se ve
 * afectado por la propiedad `color`.
 */
@Component({
  selector: 'IconPdf',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 21 24"
      fill="none"
      aria-hidden="true"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      style="flex-shrink: 0; display: inline-block;"
    >
      <path
        d="M4.8125 0.625C4.03047 0.625 3.39062 1.26484 3.39062 2.04688V21.9531C3.39062 22.7352 4.03047 23.375 4.8125 23.375H19.0312C19.8133 23.375 20.4531 22.7352 20.4531 21.9531V6.3125L14.7656 0.625H4.8125Z"
        fill="#E2E5E7"
      />
      <path
        d="M16.1875 6.3125H20.4531L14.7656 0.625V4.89062C14.7656 5.67266 15.4055 6.3125 16.1875 6.3125Z"
        fill="#B0B7BD"
      />
      <path
        d="M20.4531 10.5781L16.1875 6.3125H20.4531V10.5781Z"
        fill="#CAD1D8"
      />
      <path
        d="M17.6094 19.1094C17.6094 19.5004 17.2895 19.8203 16.8984 19.8203H1.25781C0.866797 19.8203 0.546875 19.5004 0.546875 19.1094V12C0.546875 11.609 0.866797 11.2891 1.25781 11.2891H16.8984C17.2895 11.2891 17.6094 11.609 17.6094 12V19.1094Z"
        fill="#F15642"
      />
      <path
        d="M3.64648 14.0956C3.64648 13.9079 3.79436 13.7031 4.03252 13.7031H5.34562C6.085 13.7031 6.75044 14.1979 6.75044 15.1463C6.75044 16.045 6.085 16.5455 5.34562 16.5455H4.39652V17.2962C4.39652 17.5465 4.23727 17.6879 4.03252 17.6879C3.84484 17.6879 3.64648 17.5465 3.64648 17.2962V14.0956ZM4.39652 14.419V15.8352H5.34562C5.72669 15.8352 6.02812 15.499 6.02812 15.1463C6.02812 14.7489 5.72669 14.419 5.34562 14.419H4.39652Z"
        fill="white"
      />
      <path
        d="M7.86314 17.6875C7.67545 17.6875 7.4707 17.5851 7.4707 17.3356V14.1065C7.4707 13.9025 7.67545 13.7539 7.86314 13.7539H9.16487C11.7626 13.7539 11.7058 17.6875 9.21605 17.6875H7.86314ZM8.22145 14.4478V16.9944H9.16487C10.6998 16.9944 10.768 14.4478 9.16487 14.4478H8.22145Z"
        fill="white"
      />
      <path
        d="M12.6284 14.494V15.3976H14.078C14.2828 15.3976 14.4875 15.6023 14.4875 15.8007C14.4875 15.9884 14.2828 16.1419 14.078 16.1419H12.6284V17.3356C12.6284 17.5347 12.4869 17.6875 12.2879 17.6875C12.0376 17.6875 11.8848 17.5347 11.8848 17.3356V14.1065C11.8848 13.9025 12.0383 13.7539 12.2879 13.7539H14.2835C14.5337 13.7539 14.6816 13.9025 14.6816 14.1065C14.6816 14.2885 14.5337 14.4933 14.2835 14.4933H12.6284V14.494Z"
        fill="white"
      />
      <path
        d="M16.8984 19.8203H3.39062V20.5312H16.8984C17.2895 20.5312 17.6094 20.2113 17.6094 19.8203V19.1094C17.6094 19.5004 17.2895 19.8203 16.8984 19.8203Z"
        fill="#CAD1D8"
      />
    </svg>
  `,
})
export class IconPdfComponent {
  readonly size = input<number | string>(24);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

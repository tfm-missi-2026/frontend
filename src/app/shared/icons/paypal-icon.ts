import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconPaypal`
 * -----------
 * Logo de PayPal (P estilizada) usado en el listado de métodos de
 * pago (`PaymentMethod`).
 *
 * El color es hardcoded (azul PayPal) para mantener la identidad de
 * marca, no se ve afectado por la propiedad `color`.
 */
@Component({
  selector: 'IconPaypal',
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
      <rect x="0.5" width="32" height="32" rx="16" fill="#1B4BF1" />
      <path
        opacity="0.5"
        d="M23.2413 12.5812C23.457 11.1743 23.2413 10.2365 22.4861 9.37074C21.6589 8.39679 20.1486 8 18.2066 8H12.6326C12.237 8 11.9133 8.28858 11.8414 8.68537L9.50392 23.4749C9.46796 23.7635 9.68373 24.016 9.97142 24.016H13.4237L13.172 25.5311C13.136 25.7836 13.3159 26 13.6035 26H16.5164C16.8761 26 17.1637 25.7475 17.1997 25.4228L17.8111 21.5992C17.847 21.2745 18.1707 21.022 18.4943 21.022H18.9259C21.7309 21.022 23.9605 19.8677 24.6078 16.5491C24.8595 15.1784 24.7516 13.988 24.0324 13.1944C23.8166 12.9419 23.5649 12.7615 23.2413 12.5812Z"
        fill="white"
      />
      <path
        d="M23.2413 12.5812C23.457 11.1743 23.2413 10.2365 22.4861 9.37074C21.6589 8.39679 20.1486 8 18.2066 8H12.6326C12.237 8 11.9133 8.28858 11.8414 8.68537L9.50392 23.4749C9.46796 23.7635 9.68373 24.016 9.97142 24.016H13.4237L14.2509 18.6774C14.3228 18.2806 14.6464 17.992 15.042 17.992H16.6962C19.9328 17.992 22.4501 16.6934 23.1693 12.8697C23.2053 12.7976 23.2053 12.6894 23.2413 12.5812Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M24.1967 12.8768C24.1953 12.884 24.1929 12.8968 24.1892 12.9173C24.1846 12.9428 24.1746 12.998 24.1595 13.0571C24.1535 13.0803 24.1458 13.1083 24.1356 13.14C23.7299 15.2071 22.8141 16.7099 21.4579 17.6785C20.1051 18.6446 18.4356 18.992 16.6962 18.992H15.214L14.2807 25.016H9.97134C9.05713 25.016 8.40434 24.2113 8.51152 23.3513L8.51354 23.335L10.8554 8.51812L10.8574 8.50702C11.0085 7.67314 11.7152 7 12.6325 7H18.2066C20.2089 7 22.1155 7.39441 23.2438 8.71829C23.7128 9.25723 24.0388 9.85067 24.2014 10.5451C24.3613 11.2282 24.3494 11.9515 24.2296 12.7328L24.2168 12.8163L24.1967 12.8768ZM22.486 9.37074C21.6589 8.39679 20.1485 8 18.2066 8H12.6325C12.2369 8 11.9133 8.28858 11.8413 8.68537L9.50384 23.4749C9.46788 23.7635 9.68365 24.016 9.97134 24.016H13.4237L14.2508 18.6774C14.3227 18.2806 14.6464 17.992 15.0419 17.992H16.6962C19.9327 17.992 22.45 16.6934 23.1693 12.8697C23.1887 12.8307 23.1977 12.7811 23.2075 12.7266C23.2158 12.6804 23.2247 12.6308 23.2412 12.5812C23.4569 11.1743 23.2412 10.2365 22.486 9.37074Z"
        fill="#1B4BF1"
      />
      <path
        d="M15.2218 12.6172C15.2578 12.3647 15.5814 12.0401 15.9051 12.0401H20.2924C20.7959 12.0401 21.2993 12.0762 21.7309 12.1483C22.1265 12.2204 22.8457 12.4008 23.2053 12.6172C23.4211 11.2104 23.2053 10.2725 22.4501 9.40681C21.6589 8.39679 20.1486 8 18.2066 8H12.6326C12.237 8 11.9134 8.28858 11.8414 8.68537L9.50392 23.4749C9.46796 23.7635 9.68373 24.016 9.97142 24.016H13.4237L15.2218 12.6172Z"
        fill="white"
      />
    </svg>
  `,
})
export class IconPaypalComponent {
  readonly size = input<number | string>(32);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

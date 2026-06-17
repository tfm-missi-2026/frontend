import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconInfoCircleFaq`
 * -------------------
 * Círculo con una "i" en su interior (24×26 viewBox), usado como
 * ícono decorativo en cada item del `FaqsThreeComponent`.
 *
 * El aspect ratio es ligeramente vertical (24×26) por diseño original
 * del layout de FAQ; se distingue de `IconInfoCircleBorder` (24×24).
 *
 * El color se controla con clases Tailwind pasadas vía `className`
 * (ej. `fill-current` para heredar el color del padre).
 */
@Component({
  selector: 'IconInfoCircleFaq',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 24 26"
      fill="none"
      aria-hidden="true"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      style="flex-shrink: 0; display: inline-block;"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 14C3.75 9.44365 7.44365 5.75 12 5.75C16.5563 5.75 20.25 9.44365 20.25 14C20.25 18.5563 16.5563 22.25 12 22.25C7.44365 22.25 3.75 18.5563 3.75 14ZM12 3.75C6.33908 3.75 1.75 8.33908 1.75 14C1.75 19.6609 6.33908 24.25 12 24.25C17.6609 24.25 22.25 19.6609 22.25 14C22.25 8.33908 17.6609 3.75 12 3.75ZM10.7491 9.52507C10.7491 10.2154 11.3088 10.7751 11.9991 10.7751H12.0001C12.6905 10.7751 13.2501 10.2154 13.2501 9.52507C13.2501 8.83472 12.6905 8.27507 12.0001 8.27507H11.9991C11.3088 8.27507 10.7491 8.83472 10.7491 9.52507ZM12.0001 19.6214C11.4478 19.6214 11.0001 19.1737 11.0001 18.6214V12.9449C11.0001 12.3926 11.4478 11.9449 12.0001 11.9449C12.5524 11.9449 13.0001 12.3926 13.0001 12.9449V18.6214C13.0001 19.1737 12.5524 19.6214 12.0001 19.6214Z"
        fill="currentColor"
      />
    </svg>
  `,
})
export class IconInfoCircleFaqComponent {
  readonly size = input<number | string>(24);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

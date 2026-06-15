import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconChevronLeft`
 * ----------------
 * Chevron apuntando a la izquierda. Usado como `prevIcon` por defecto
 * en la paginación de `UiTable`.
 *
 * Usa `currentColor` para el `fill`, por lo que se controla con la
 * propiedad `color` o con la clase de color del padre.
 */
@Component({
  selector: 'IconChevronLeft',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 20 20"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      [style.color]="color()"
      style="flex-shrink: 0; display: inline-block;"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.7071 4.29289C13.0976 4.68342 13.0976 5.31658 12.7071 5.70711L8.41421 10L12.7071 14.2929C13.0976 14.6834 13.0976 15.3166 12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L6.29289 10.7071C5.90237 10.3166 5.90237 9.68342 6.29289 9.29289L11.2929 4.29289C11.6834 3.90237 12.3166 3.90237 12.7071 4.29289Z"
        fill="currentColor"
      />
    </svg>
  `,
})
export class IconChevronLeftComponent {
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

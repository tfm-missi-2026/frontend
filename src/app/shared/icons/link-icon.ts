import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconLink`
 * ---------
 * Ícono de cadena / eslabón. Usado como `leftIcon` en enlaces de tipo
 * "Card link" o en cualquier acción que represente un vínculo o
 * asociación entre elementos.
 *
 * Usa `fill="currentColor"`, por lo que se controla con la propiedad
 * `color` o con la clase de color del padre.
 */
@Component({
  selector: 'IconLink',
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.88029 3.10905C8.54002 1.44932 11.231 1.44933 12.8907 3.10906C14.5504 4.76878 14.5504 7.45973 12.8907 9.11946L12.0654 9.94479L11.0047 8.88413L11.83 8.0588C12.904 6.98486 12.904 5.24366 11.83 4.16972C10.7561 3.09577 9.01489 3.09577 7.94095 4.16971L7.11562 4.99504L6.05496 3.93438L6.88029 3.10905ZM8.88339 11.0055L9.94405 12.0661L9.11946 12.8907C7.45973 14.5504 4.76878 14.5504 3.10905 12.8907C1.44933 11.231 1.44933 8.54002 3.10905 6.88029L3.93364 6.0557L4.9943 7.11636L4.16971 7.94095C3.09577 9.01489 3.09577 10.7561 4.16971 11.83C5.24366 12.904 6.98486 12.904 8.0588 11.83L8.88339 11.0055ZM9.94422 7.11599C10.2371 6.8231 10.2371 6.34823 9.94422 6.05533C9.65132 5.76244 9.17645 5.76244 8.88356 6.05533L6.05513 8.88376C5.76224 9.17665 5.76224 9.65153 6.05513 9.94442C6.34802 10.2373 6.8229 10.2373 7.11579 9.94442L9.94422 7.11599Z"
        fill="currentColor"
      />
    </svg>
  `,
})
export class IconLinkComponent {
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

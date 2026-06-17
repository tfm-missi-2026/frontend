import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconEye`
 * --------
 * Icono "ojo" usado como `rightIcon` en `UiInput` para alternar
 * visibilidad de contraseñas.
 *
 * Usa `stroke="currentColor"` para los trazos, por lo que se controla
 * con la propiedad `color` o con la clase de color del padre.
 */
@Component({
  selector: 'IconEye',
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
        d="M1 8C2.5 4.5 5 2.5 8 2.5C11 2.5 13.5 4.5 15 8C13.5 11.5 11 13.5 8 13.5C5 13.5 2.5 11.5 1 8Z"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <circle
        cx="8"
        cy="8"
        r="2"
        stroke="currentColor"
        stroke-width="1.5"
      />
    </svg>
  `,
})
export class IconEyeComponent {
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

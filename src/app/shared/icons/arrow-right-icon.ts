import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconArrowRight`
 * ---------------
 * Flecha apuntando a la derecha. Usada típicamente como `rightIcon` en
 * enlaces de "Read more" / "Continuar" o como indicador de navegación.
 *
 * Usa `fill="currentColor"`, por lo que se controla con la propiedad
 * `color` o con la clase de color del padre.
 */
@Component({
  selector: 'IconArrowRight',
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
        d="M14.0836 7.99888C14.0838 8.19107 14.0107 8.38334 13.8641 8.53001L9.86678 12.5301C9.57399 12.8231 9.09911 12.8233 8.80612 12.5305C8.51312 12.2377 8.51296 11.7629 8.80575 11.4699L11.526 8.74772L2.66602 8.74772C2.2518 8.74772 1.91602 8.41194 1.91602 7.99772C1.91602 7.58351 2.2518 7.24772 2.66602 7.24772L11.5216 7.24772L8.80576 4.53016C8.51296 4.23718 8.51311 3.7623 8.8061 3.4695C9.09909 3.1767 9.57396 3.17685 9.86676 3.46984L13.8292 7.43478C13.9852 7.57222 14.0836 7.77348 14.0836 7.99772C14.0836 7.99811 14.0836 7.9985 14.0836 7.99888Z"
        fill="currentColor"
      />
    </svg>
  `,
})
export class IconArrowRightComponent {
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

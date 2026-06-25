import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconArrowLeft`
 * --------------
 * Flecha apuntando a la izquierda. Usada como "back" en formularios
 * de auth (`SigninForm`, `SignupForm`) y como indicador de navegación
 * hacia atrás.
 *
 * Usa `stroke="currentColor"` para los trazos, por lo que se controla
 * con la propiedad `color` o con la clase de color del padre.
 */
@Component({
  selector: 'IconArrowLeft',
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
      [style.color]="color()"
      style="flex-shrink: 0; display: inline-block;"
    >
      <path
        d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class IconArrowLeftComponent {
  readonly size = input<number | string>(20);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly color = input<string>('currentColor');
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

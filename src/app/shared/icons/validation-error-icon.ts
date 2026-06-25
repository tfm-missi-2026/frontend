import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconValidationError`
 * ---------------------
 * Círculo con un signo de exclamación en formato outline (14×14).
 * Usado como icono de error de validación dentro de inputs, selects y
 * otros controles del design system. El mensaje de error completo se
 * expone como `title` nativo (tooltip del navegador).
 *
 * Variante de menor tamaño y trazo fino de `IconError` (24×24, fill)
 * — preferida cuando el icono convive con texto o está dentro de un
 * control compacto.
 *
 * Usa `currentColor` para los trazos y el fill, por lo que se controla
 * con la propiedad `color` o con la clase de color del padre.
 */
@Component({
  selector: 'IconValidationError',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      [style.color]="color()"
      style="flex-shrink: 0; display: inline-block;"
    >
      <circle
        cx="7"
        cy="7"
        r="6"
        stroke="currentColor"
        stroke-width="1.2"
      />
      <path
        d="M7 4V7.5"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
      />
      <circle cx="7" cy="9.6" r="0.7" fill="currentColor" />
    </svg>
  `,
})
export class IconValidationErrorComponent {
  readonly size = input<number | string>(14);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly color = input<string>('currentColor');
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconTrashLight`
 * ---------------
 * Icono "papelera" para acciones de borrado en filas de tabla.
 *
 * Usa `currentColor` para el `fill`, por lo que se controla con la
 * propiedad `color` o con la clase de color del padre.
 */
@Component({
  selector: 'IconTrashLight',
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
        d="M8.75 1A2.25 2.25 0 0 0 6.5 3.25v.443c-.57.057-1.13.13-1.682.232A1.5 1.5 0 0 0 3.5 5.404V6.5h13v-1.096a1.5 1.5 0 0 0-1.318-1.479 18.7 18.7 0 0 0-1.682-.232V3.25A2.25 2.25 0 0 0 11.25 1h-2.5ZM5 8.5v7A2.5 2.5 0 0 0 7.5 18h5a2.5 2.5 0 0 0 2.5-2.5v-7H5Z"
        fill="currentColor"
      />
    </svg>
  `,
})
export class IconTrashLightComponent {
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

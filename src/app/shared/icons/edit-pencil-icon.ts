import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconEditPencil`
 * ---------------
 * Icono "lápiz + diagonal" usado en el botón "Update Billing Address"
 * de `BillingInfo`.
 *
 * Variante stroke-based de 21×20 de `IconEditLight` (que es 20×20
 * fill-based).
 *
 * Usa `stroke="currentColor"` para los trazos, por lo que se controla
 * con la propiedad `color` o con la clase de color del padre.
 */
@Component({
  selector: 'IconEditPencil',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 21 20"
      fill="none"
      aria-hidden="true"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      [style.color]="color()"
      style="flex-shrink: 0; display: inline-block;"
    >
      <path
        d="M12.8861 5.08135L15.4182 7.61345M16.1437 3.59219L16.908 4.35652C17.3962 4.84468 17.3962 5.63613 16.908 6.12429L8.33547 14.6968C8.19039 14.8419 8.01182 14.9491 7.81554 15.0088L4.47461 16.0256L5.49141 12.6847C5.55115 12.4884 5.65829 12.3098 5.80337 12.1647L14.3759 3.59219C14.8641 3.10404 15.6555 3.10404 16.1437 3.59219Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class IconEditPencilComponent {
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

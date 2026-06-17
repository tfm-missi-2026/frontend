import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconCheckCheckboxDisabled`
 * ---------------------------
 * Checkmark gris de 14×14 usado como indicador visual de "checked"
 * en estado deshabilitado dentro del componente `CheckboxComponent`.
 *
 * El trazo usa un color gris fijo (#E4E7EC) y un grosor mayor para
 * distinguirlo del estado habilitado; no se ve afectado por la
 * propiedad `color`.
 */
@Component({
  selector: 'IconCheckCheckboxDisabled',
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
      style="flex-shrink: 0; display: inline-block;"
    >
      <path
        d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
        stroke="#E4E7EC"
        stroke-width="2.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class IconCheckCheckboxDisabledComponent {
  readonly size = input<number | string>(14);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

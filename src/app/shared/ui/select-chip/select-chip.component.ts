import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { IconXComponent } from "@shared/icons";

const CONTAINER_BASE =
  "inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-md py-0.5 px-2 text-xs text-gray-800 dark:text-gray-200 max-w-full";
const DISABLED_CLASSES = "opacity-70";
const REMOVE_BUTTON_BASE =
  "inline-flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer rounded text-gray-500 hover:text-error-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors";

/**
 * `UiSelectChip`
 * --------------
 * Pill removible con label truncado y botón de cierre (icono X).
 *
 * Pensado para chips de selección en selects multi, filtros aplicados o
 * tags de inputs con autocompletado. El click en el botón de cierre
 * detiene la propagación para no disparar handlers del control padre
 * (por ejemplo, abrir el menú del select).
 *
 * Estados:
 *  - `disabled` o `readOnly` → se atenúa y se oculta el botón.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiSelectChip",
  standalone: true,
  imports: [IconXComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="containerClasses()">
      <span class="truncate max-w-50">{{ label() }}</span>
      @if (!isInactive()) {
        <button
          type="button"
          [class]="removeButtonClass()"
          (click)="onRemove($event)"
          [attr.aria-label]="removeLabel()"
          data-testid="select-chip-remove"
        >
          <IconX [size]="removeIconSize()" />
        </button>
      }
    </span>
  `,
})
export class UiSelectChipComponent {
  /** Texto del chip. */
  readonly label = input<string>("");
  /** Si `true`, oculta el botón remove y atenúa el chip. */
  readonly disabled = input<boolean>(false);
  /** Si `true`, oculta el botón remove y atenúa el chip. */
  readonly readOnly = input<boolean>(false);
  /** aria-label internacionalizable del botón remove. */
  readonly removeLabel = input<string>("Quitar");
  /** Clases extra aplicadas al contenedor exterior. */
  readonly className = input<string>("");
  /** Tamaño (en px) del icono X. Default: `10`. */
  readonly removeIconSize = input<number | string>(10);

  /** Se emite cuando el usuario pulsa el botón remove. */
  readonly remove = output<void>();

  readonly isInactive = computed<boolean>(
    () => this.disabled() || this.readOnly(),
  );

  readonly containerClasses = computed<string>(() => {
    const base = CONTAINER_BASE;
    const state = this.isInactive() ? DISABLED_CLASSES : "";
    const extra = this.className();
    return extra
      ? `${base} ${state} ${extra}`.trim()
      : `${base} ${state}`.trim();
  });

  readonly removeButtonClass = computed<string>(() => REMOVE_BUTTON_BASE);

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.remove.emit();
  }
}

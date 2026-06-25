import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

export type SwitchColor = "brand" | "gray";

/**
 * `UiSwitch`
 * ----------
 * Toggle / switch del design system.
 *
 * Capacidades:
 *  - Estado `checked` controlado.
 *  - Estado `disabled` con cursor y colores deshabilitados.
 *  - Color semántico `brand` (default) o `gray` (monocromo).
 *  - `<input type="checkbox">` real (oculto) para accesibilidad y
 *    soporte de formularios.
 *  - `checkedChange` emite el nuevo estado.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiSwitch",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label
      [class]="wrapperClasses()"
      (click)="onToggle()"
    >
      <div class="relative">
        <div
          class="block transition duration-150 ease-linear h-6 w-11 rounded-full"
          [class]="trackClasses()"
          aria-hidden="true"
        ></div>
        <div
          class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform"
          [class]="knobClasses()"
          aria-hidden="true"
        ></div>
      </div>

      @if (label()) {
        <span>{{ label() }}</span>
      }

      <input
        type="checkbox"
        class="sr-only"
        [checked]="checked()"
        [disabled]="disabled()"
        (change)="onInputChange($event)"
        [attr.aria-label]="label() || null"
        data-testid="switch-input"
      />
    </label>
  `,
})
export class UiSwitchComponent {
  /** Texto del label (opcional). */
  readonly label = input<string | undefined>(undefined);
  /** Estado actual del switch. */
  readonly checked = input<boolean>(false);
  /** Deshabilita el switch. */
  readonly disabled = input<boolean>(false);
  /** Color semántico. Default `'brand'`. */
  readonly color = input<SwitchColor>("brand");
  /** Clases extra para el wrapper. */
  readonly className = input<string>("");

  readonly checkedChange = output<boolean>();

  onToggle(): void {
    if (this.disabled()) return;
    this.checkedChange.emit(!this.checked());
  }

  onInputChange(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    const next = (event.target as HTMLInputElement).checked;
    this.checkedChange.emit(next);
  }

  // ---------------------------------------------------------------------------
  // Computed styling
  // ---------------------------------------------------------------------------

  readonly wrapperClasses = computed<string>(() =>
    [
      "flex cursor-pointer select-none items-center gap-3 text-sm font-medium",
      this.disabled() ? "text-gray-400" : "text-gray-700 dark:text-gray-400",
      this.className(),
    ]
      .filter(Boolean)
      .join(" "),
  );

  readonly trackClasses = computed<string>(() => {
    if (this.disabled())
      return "bg-gray-100 pointer-events-none dark:bg-gray-800";
    if (this.color() === "gray") {
      return this.checked()
        ? "bg-gray-800 dark:bg-white/10"
        : "bg-gray-200 dark:bg-white/10";
    }
    return this.checked()
      ? "bg-brand-500"
      : "bg-gray-200 dark:bg-white/10";
  });

  readonly knobClasses = computed<string>(() =>
    this.checked() ? "translate-x-full bg-white" : "translate-x-0 bg-white",
  );
}

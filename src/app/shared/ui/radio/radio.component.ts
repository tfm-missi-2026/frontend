import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

/**
 * `UiRadio`
 * ---------
 * Radio button del design system.
 *
 * Capacidades:
 *  - Tamaño seleccionable entre `md` (20 px) y `sm` (16 px).
 *  - Estado `checked` controlado.
 *  - Estado `disabled` con cambio de colores.
 *  - `<input type="radio">` real (oculto visualmente con `sr-only`),
 *    accesible y compatible con `name`/`form`.
 *  - `valueChange` emite el `value` del item seleccionado.
 *
 * Cada instancia es autocontenida; el caller es responsable de
 * compartir el `name` entre los radios del mismo grupo y mantener
 * el `checked` sincronizado externamente.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiRadio",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label
      [attr.for]="id()"
      [class]="wrapperClasses()"
    >
      <input
        [id]="id()"
        [name]="name()"
        type="radio"
        [value]="value()"
        [checked]="checked()"
        [disabled]="disabled()"
        (change)="onChange()"
        class="sr-only"
        data-testid="radio-input"
      />

      <span
        [class]="circleClasses()"
        aria-hidden="true"
      >
        <span [class]="dotClasses()"></span>
      </span>

      @if (label()) {
        <span [class]="labelClasses()">{{ label() }}</span>
      }
    </label>
  `,
})
export class UiRadioComponent {
  /** `id` del `<input>`. */
  readonly id = input<string>("");
  /** Nombre del grupo (atributo `name`). */
  readonly name = input<string>("");
  /** Valor único de esta opción. */
  readonly value = input<string>("");
  /** Estado seleccionado. */
  readonly checked = input<boolean>(false);
  /** Texto del label. Si se omite, no se renderiza label visible. */
  readonly label = input<string | undefined>(undefined);
  /** Tamaño: `md` (20 px, default) o `sm` (16 px). */
  readonly size = input<"md" | "sm">("md");
  /** Deshabilita la opción. */
  readonly disabled = input<boolean>(false);
  /** Clases extra para el wrapper. */
  readonly className = input<string>("");

  readonly valueChange = output<string>();

  onChange(): void {
    if (this.disabled()) return;
    this.valueChange.emit(this.value());
  }

  // ---------------------------------------------------------------------------
  // Computed styling
  // ---------------------------------------------------------------------------

  readonly isSm = computed<boolean>(() => this.size() === "sm");

  readonly wrapperClasses = computed<string>(() =>
    [
      "relative flex cursor-pointer select-none items-center gap-3 text-sm font-medium",
      this.disabled()
        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
        : "text-gray-700 dark:text-gray-400",
      this.className(),
    ]
      .filter(Boolean)
      .join(" "),
  );

  readonly circleClasses = computed<string>(() => {
    const sizeBox = this.isSm() ? "h-4 w-4" : "h-5 w-5";
    const sizeDot = this.isSm() ? "h-1.5 w-1.5" : "h-2 w-2";
    const border = this.isSm() ? "border" : "border-[1.25px]";
    return [
      "flex items-center justify-center rounded-full",
      border,
      sizeBox,
      this.checked()
        ? "border-brand-500 bg-brand-500"
        : "bg-transparent border-gray-300 dark:border-gray-700",
      this.disabled() ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700" : "",
    ]
      .filter(Boolean)
      .join(" ");
  });

  readonly dotClasses = computed<string>(() => {
    const sizeDot = this.isSm() ? "h-1.5 w-1.5" : "h-2 w-2";
    return [
      "rounded-full bg-white",
      sizeDot,
      this.checked() ? "block" : "hidden",
    ]
      .filter(Boolean)
      .join(" ");
  });

  readonly labelClasses = computed<string>(() =>
    this.disabled() ? "opacity-60" : "",
  );
}

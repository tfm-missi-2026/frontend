import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

const VALUE_CLASSES = "text-sm text-gray-800 dark:text-white truncate";
const PLACEHOLDER_CLASSES = "text-sm text-gray-400 dark:text-gray-500 m-0";

/**
 * `UiFieldValue`
 * --------------
 * Span que muestra el valor actual de un control de formulario, o el
 * `placeholder` cuando no hay valor. Pensado para vivir dentro del
 * contenedor de un field (input, select) que necesita proyectar un
 * texto controlado encima del control real.
 *
 * Comportamiento:
 *  - Si `value()` es no vacío → renderiza el valor con color principal.
 *  - Si `value()` está vacío pero `placeholder()` no → renderiza el
 *    placeholder con color tenue.
 *  - Si ambos están vacíos → no renderiza nada.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiFieldValue",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (value(); as v) {
      <span [class]="valueClasses()">{{ v }}</span>
    } @else if (placeholder(); as p) {
      <span [class]="placeholderClasses()">{{ p }}</span>
    }
  `,
})
export class UiFieldValueComponent {
  /** Valor a mostrar. Si vacío, se muestra el placeholder. */
  readonly value = input<string | undefined>(undefined);
  /** Texto mostrado cuando no hay valor. */
  readonly placeholder = input<string>("");
  /** Clases extra aplicadas al span de valor. */
  readonly valueClassName = input<string>("");
  /** Clases extra aplicadas al span de placeholder. */
  readonly placeholderClassName = input<string>("");

  readonly valueClasses = computed<string>(() => {
    const extra = this.valueClassName();
    return extra ? `${VALUE_CLASSES} ${extra}` : VALUE_CLASSES;
  });

  readonly placeholderClasses = computed<string>(() => {
    const extra = this.placeholderClassName();
    return extra ? `${PLACEHOLDER_CLASSES} ${extra}` : PLACEHOLDER_CLASSES;
  });
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

const BASE_STYLES = "text-xs text-error-500 leading-4";

/**
 * `UiFieldError`
 * --------------
 * Mensaje de error bajo un campo de formulario (input, select, textarea).
 * Si `message` está vacío o es `undefined`, no se renderiza nada.
 *
 * Atributos:
 *  - `role="alert"` → lectores de pantalla anuncian el cambio al
 *    aparecer o actualizarse.
 *  - `id` opcional → permite referenciarlo desde el control con
 *    `aria-describedby` para accesibilidad.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiFieldError",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (resolvedMessage(); as msg) {
      <span
        [id]="id() || null"
        [class]="containerClasses()"
        role="alert"
        data-testid="field-error"
      >
        {{ msg }}
      </span>
    }
  `,
})
export class UiFieldErrorComponent {
  /** Mensaje a mostrar. Vacío o `undefined` → no se renderiza. */
  readonly message = input<string | undefined>(undefined);
  /** `id` del span (para `aria-describedby` desde el control asociado). */
  readonly id = input<string | undefined>(undefined);
  /** Clases extra aplicadas al contenedor. */
  readonly className = input<string>("");

  readonly resolvedMessage = computed<string>(() => this.message() ?? "");

  readonly containerClasses = computed<string>(() => {
    const extra = this.className();
    return extra ? `${BASE_STYLES} ${extra}` : BASE_STYLES;
  });
}

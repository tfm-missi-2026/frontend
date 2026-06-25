/**
 * Public API del `UiFieldError`.
 *
 * Mensaje de error de un campo de formulario. Solo se renderiza cuando
 * recibe un `message` no vacío. Pensado para vivir al final del
 * wrapper de un field (input, select, textarea) y ser apuntado vía
 * `aria-describedby` desde el control asociado.
 */
export { UiFieldErrorComponent } from "./field-error.component";

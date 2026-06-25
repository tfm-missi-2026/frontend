/**
 * Posición absoluta del dropdown respecto a su trigger.
 *
 * - `right` (default): alineado a la derecha del trigger.
 * - `left`: alineado a la izquierda del trigger.
 * - `center`: centrado respecto al trigger.
 */
export type DropdownAlignment = "right" | "left" | "center";

/**
 * Tag HTML que se renderiza para los items del dropdown.
 *
 * - `button` (default): renderiza un `<button type="button">`.
 * - `a`: renderiza un `<a [routerLink]>` (requiere `to`).
 */
export type DropdownItemTag = "button" | "a";

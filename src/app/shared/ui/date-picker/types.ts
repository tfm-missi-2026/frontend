/**
 * Modos soportados por `UiDatePicker`. Réplica del `mode` de `flatpickr`.
 */
export type DatePickerMode = "single" | "multiple" | "range";

/**
 * Valor emitido por `UiDatePicker` (string ISO en `single`, array en
 * `multiple`/`range`).
 */
export type DatePickerValue = string | string[];

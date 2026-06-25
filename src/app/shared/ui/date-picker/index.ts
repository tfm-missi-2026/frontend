/**
 * Public API del `UiDatePicker`.
 *
 * Date picker construido sobre `flatpickr` con label, error, modo
 * `single`/`multiple`/`range`, `disabled`/`readOnly`, `min`/`max` y
 * `ControlValueAccessor` para integración con formularios reactivos.
 *
 * Standalone + OnPush + signal APIs.
 */
export { UiDatePickerComponent } from "./date-picker.component";
export type { DatePickerMode, DatePickerValue } from "./types";

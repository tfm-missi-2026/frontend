/**
 * Public API del `UiPhoneInput`.
 *
 * Input de teléfono con selector de código de país configurable,
 * posición del selector (`start`/`end`), `disabled`/`readOnly` y
 * `ControlValueAccessor` para integración con formularios reactivos.
 * Standalone + OnPush + signal APIs.
 */
export { UiPhoneInputComponent } from "./phone-input.component";
export type { CountryCode, PhoneSelectPosition } from "./types";

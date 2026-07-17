/**
 * Posición del selector de país en `UiPhoneInput`.
 */
export type PhoneSelectPosition = "start" | "end";

/**
 * País soportado por `UiPhoneInput`. `code` es el código internacional
 * (+1, +34, +52, …) y `label` es el número/máscara asociada.
 */
export interface CountryCode {
  /** Código internacional (ej. `+1`, `+34`, `+52`). */
  code: string;
  /** Número/máscara por defecto del país (ej. `(555) 000-0000`). */
  label: string;
}

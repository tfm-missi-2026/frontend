/**
 * Interfaz de cada opción mostrada en el Select.
 */
export interface SelectOption<TValue = string | number> {
  /** Valor primitivo que se emite en el `onChange`. */
  value: TValue;
  /** Texto que se muestra al usuario. */
  label: string;
  /** Permite deshabilitar una opción individual. */
  disabled?: boolean;
  /** Campos extra para data personalizada. */
  [key: string]: unknown;
}

/**
 * Función usada para cargar opciones de forma asíncrona.
 * Se invoca con el texto de búsqueda y debe devolver un `Promise` con las opciones.
 */
export type LoadOptionsFn<TValue = string | number> = (
  search: string,
) => Promise<SelectOption<TValue>[]>;

/** Función que devuelve un mensaje (loading / no options). */
export type MessageFn = () => string;

/**
 * Tipo de valor que el componente expone hacia el `ControlValueAccessor`.
 * - `null` cuando no hay selección
 * - `TValue` en modo single
 * - `TValue[]` en modo multi
 */
export type SelectValue<TValue = string | number> =
  | null
  | TValue
  | TValue[];
import { Type } from '@angular/core';

/**
 * Tipos del `Input`.
 * Réplica de `./types.ts` del proyecto React.
 *
 * `StyledInputProps` replica las "transient props" (`$prop`) que styled-components
 * usaba para no filtrar las props al DOM. En Angular los `@Input` no se filtran
 * al DOM, pero se conserva la nomenclatura por simetría con la API original.
 */
export interface StyledInputProps {
  $errorMessage?: string;
  $disabled?: boolean;
  $readOnly?: boolean;
  $leftIcon?: unknown;
  $rightIcon?: unknown;
}

/**
 * Props del componente `Input`.
 *
 * En Angular, los outputs se nombran siguiendo la convención `xxxChange`:
 *   - `onChange` (React)  → `valueChange` (Angular)
 *   - `onEnterKey` (React) → `enterKey` (Angular)
 *   - `onKeyDown` (React)  → `keyDown` (Angular)
 */
export interface InputProps {
  /** `id` del input (también se usa como `for` del `<label>`). */
  id?: string;
  /** `name` del input. */
  name?: string;
  /** Texto del label. Si se omite, no se renderiza label. */
  labelText?: string;
  /** Muestra el asterisco `*` en el label (oculto si `disabled`/`readOnly`). */
  required?: boolean;
  /** Deshabilita el input. */
  disabled?: boolean;
  /** Tooltip junto al label. */
  tooltip?: string;
  /** Mensaje de error (cambia el borde a rojo y muestra un icono). */
  errorMessage?: string;
  /** Marca el input como solo lectura. */
  readOnly?: boolean;
  /** Placeholder. */
  placeholder?: string;
  /** Componente Angular a renderizar a la izquierda (icono). */
  leftIcon?: Type<unknown>;
  /** Componente Angular a renderizar a la derecha (icono). */
  rightIcon?: Type<unknown>;
  /** Prefijo en línea dentro del input (color `textAction`). */
  prefix?: string;
  /** Sufijo en línea dentro del input (color `textAction`). */
  sufix?: string;
  /** Shorthand `flex` CSS del contenedor exterior. */
  flex?: string;
  /** Máximo de caracteres. Activa el contador. */
  maxLength?: number;
  /** Valor controlado. Si se omite, el input es no-controlado. */
  value?: string | number;
  /** Tiempo de debounce (ms) para `valueChange` cuando el input es no-controlado. */
  debounceTime?: number;
  /** `width` CSS del contenedor exterior. */
  width?: string;
  /** Texto de ayuda debajo del input. */
  legend?: string;
}

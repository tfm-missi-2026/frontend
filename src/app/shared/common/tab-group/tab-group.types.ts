/**
 * Public API del `CommonTabGroup`.
 *
 * Segmented control genérico. El consumidor pasa la lista de tabs
 * vía `tabs` y opcionalmente el id seleccionado (modo controlado).
 * Renderiza cada tab con `UiButton` del design system.
 */

/**
 * Cada opción/tab mostrada en el `CommonTabGroup`.
 *
 * Réplica de `SelectOption<TValue>` (mismo extension point
 * `[key: string]: unknown`) para mantener consistencia con el
 * resto del design system.
 */
export interface CommonTabOption<TId = string> {
  /** Identificador único del tab. Se emite en `selectedChange`. */
  value: TId;
  /** Texto visible en el botón. */
  label: string;
  /** Si `true`, el botón se renderiza deshabilitado. */
  disabled?: boolean;
  /** Campos extra (data personalizada del consumidor). */
  [key: string]: unknown;
}

/** Tamaños soportados por `CommonTabGroup`. */
export type CommonTabGroupSize = 'sm' | 'md';
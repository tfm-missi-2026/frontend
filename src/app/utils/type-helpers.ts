/**
 * Helpers de tipos para el design system.
 *
 * `TransientProps<T>` replica el patrón `$prop` de `styled-components`,
 * usado en el proyecto React para evitar que las props personalizadas
 * se reenvíen al DOM. En Angular no es estrictamente necesario
 * (los `@Input` no se filtran al DOM), pero se conserva la utilidad
 * por simetría con la API original.
 */
export type TransientProps<T> = {
  [K in keyof T as K extends string ? `$${K}` : K]: T[K];
};

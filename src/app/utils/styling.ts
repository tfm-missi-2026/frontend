/**
 * Helpers de styling para el design system.
 *
 * Réplica Angular de los helpers de `styled-components` del proyecto React.
 * Aquí solo viven utilidades puramente de clases (sin lógica de DOM) para
 * que puedan consumirse tanto desde templates como desde `getVariantClasses`.
 */

/**
 * Devuelve la clase Tailwind que aplica el outline de foco accesible.
 * Equivalente a `getFocusStyling()` del proyecto React (styled-components).
 *
 * Por defecto aplica el outline en `focus-visible` (teclado), no en
 * `focus` (mouse), con `outline-offset: -1px` para que el borde se
 * "subraye" por dentro del componente.
 */
export const getFocusStyling = (
  focusStrategy: 'visible' | 'within' = 'visible',
): string => {
  return [
    `focus-${focusStrategy}:outline-2`,
    'focus-visible:outline-[var(--color-foreground-focus)]',
    'focus-visible:outline-offset-[-1px]',
  ].join(' ');
};

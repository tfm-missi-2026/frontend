/**
 * Public API del `UiButton`.
 *
 * Botón con variantes (`primary` | `secondary` | `tertiary`), estilos
 * (solid, outline, ghost), tamaños, iconos, loading, tooltip, link,
 * destructive, etc. Standalone + OnPush + signal APIs.
 *
 * `UiIconButton` (en `@ui/icon-button`) es la variante circular solo
 * con icono del mismo design system.
 */
export { UiButtonComponent } from './button.component';
export type {
  ButtonVariant,
  ButtonStyleType,
  ButtonTooltip,
  ButtonLinkProps,
  ButtonCommonProps,
  ButtonProps,
  IconButtonProps,
} from './types';

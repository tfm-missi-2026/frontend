/**
 * Public API del `UiLink`.
 *
 * Enlace del design system. Renderiza siempre un `<a>` HTML y soporta
 * `routerLink` (`to`) y URL externa (`href`). El slot `<ng-content>` es
 * editable con HTML arbitrario. Standalone + OnPush + signal APIs.
 */
export { UiLinkComponent } from './link';
export type {
  LinkProps,
  LinkVariant,
  LinkSize,
  LinkUnderline,
} from './link.types';

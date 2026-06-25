/**
 * Public API del `UiCard`.
 *
 * Contenedor genérico de tarjeta con borde, padding, fondo y soporte
 * de modo oscuro configurables. Expone `<ng-content>` para composición
 * libre. Standalone + OnPush + signal APIs.
 */
export { UiCardComponent } from './card.component';
export type {
  CardProps,
  CardPadding,
  CardVariant,
} from './card.types';

/**
 * Public API del `UiDropdown`.
 *
 * Contenedor genérico de dropdown con click-outside, cierre por `Escape`,
 * alineación configurable y render condicional. Standalone + OnPush +
 * signal APIs. Pensado para usarse con `UiDropdownItem` (subcomponente
 * re-exportado desde este mismo paquete).
 */
export { UiDropdownComponent } from './dropdown';
export { UiDropdownItemComponent } from './dropdown-item';
export type { DropdownAlignment, DropdownItemTag } from './dropdown.types';

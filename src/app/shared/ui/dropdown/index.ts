/**
 * Public API del `UiDropdown`.
 *
 * Contenedor genérico de dropdown con click-outside, cierre por `Escape`,
 * alineación configurable y render condicional. Standalone + OnPush +
 * signal APIs. Pensado para usarse con `UiDropdownItem` (subcomponente
 * re-exportado desde este mismo paquete).
 */
export { UiDropdownComponent } from './dropdown.component';
export { UiDropdownItemComponent } from './dropdown-item/dropdown-item.component';
export type { DropdownAlignment, DropdownItemTag } from './dropdown.types';

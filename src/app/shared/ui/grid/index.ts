/**
 * Public API de `UiGrid`.
 *
 * Contenedor de layout responsive que colapsa a una columna en mobile
 * y pasa a N columnas a partir del breakpoint configurado. Es 100%
 * genérico: proyecta cualquier contenido vía `<ng-content>`.
 *
 * @example
 * ```html
 * <UiGrid [columns]="3" breakpoint="sm" gap="gap-5" ariaLabel="Galería">
 *   <UiImage src="/a.png" alt="A" />
 *   <UiImage src="/b.png" alt="B" />
 *   <UiImage src="/c.png" alt="C" />
 * </UiGrid>
 * ```
 */
export { UiGridComponent } from "./grid.component";
export type { GridBreakpoint, GridColumns } from "./grid.types";

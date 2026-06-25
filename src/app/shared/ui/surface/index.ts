/**
 * Public API del `UiSurface`.
 *
 * Contenedor genérico con `border` + `radius` + `padding` + variante
 * semántica (`success` | `error` | `warning` | `info` | `neutral`).
 * Reacciona al cambio de tema. Standalone + OnPush + signal APIs.
 */
export { UiSurfaceComponent } from './surface.component';
export {
  SURFACE_BASE_CLASSES,
  SURFACE_PADDING_CLASSES,
  SURFACE_VARIANT_CLASSES,
} from './surface.variants';
export type { SurfacePadding, SurfaceVariant } from './surface.types';

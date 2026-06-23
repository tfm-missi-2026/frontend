/**
 * Public API del `CommonBreadcrumb`.
 *
 * Breadcrumb semántico del namespace `common/`. Standalone + OnPush +
 * signal APIs. Dos formas de uso: atajo `pageTitle` (2 segmentos) o
 * trail completo `items` (N segmentos).
 */
export { CommonBreadcrumbComponent } from './page-breadcrumb.component';
export type {
  CommonBreadcrumbItem,
  CommonBreadcrumbProps,
} from './breadcrumb.types';

/**
 * Tipos del `CommonBreadcrumb`.
 */

/**
 * Item individual del breadcrumb.
 *
 * - `label`: texto visible del segmento.
 * - `route`: ruta opcional. Si se omite, el segmento se renderiza
 *   como `<span>` en lugar de `<a>`.
 */
export interface CommonBreadcrumbItem {
  label: string;
  route?: string;
}

/**
 * Props del `CommonBreadcrumbComponent`.
 */
export interface CommonBreadcrumbProps {
  /** Trail completo. Si se pasa, se ignora `pageTitle`. */
  items?: CommonBreadcrumbItem[];
  /** Atajo para un breadcrumb de 2 segmentos: `[home, pageTitle]`. */
  pageTitle?: string;
  /** Texto del primer segmento (home). Default: `'Home'`. */
  homeLabel?: string;
  /** Ruta del primer segmento. Default: `'/'`. */
  homeRoute?: string;
  /** Clases extra aplicadas al `<nav>`. */
  className?: string;
}

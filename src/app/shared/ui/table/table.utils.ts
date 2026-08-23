import { HttpParams } from "@angular/common/http";

import { BaseQueryParams } from "@core/query-params";

/**
 * Helpers del UiTable.
 *
 * Mapa de anchos predefinidos -> clases Tailwind estaticas. Es un mapa
 * cerrado (no acepta cualquier valor) para que el JIT de Tailwind detecte
 * las clases en build time.
 */
const WIDTH_CLASS_MAP: Record<string, string> = {
  "60px": "min-w-[60px]",
  "80px": "min-w-[80px]",
  "100px": "min-w-[100px]",
  "120px": "min-w-[120px]",
  "140px": "min-w-[140px]",
  "160px": "min-w-[160px]",
  "180px": "min-w-[180px]",
  "200px": "min-w-[200px]",
  "240px": "min-w-[240px]",
  "280px": "min-w-[280px]",
  "320px": "min-w-[320px]",
};

/**
 * Devuelve la clase Tailwind correspondiente al ancho declarado en la
 * columna, o "" si no es uno de los anchos predefinidos.
 */
export function tableWidthClass(width: string | undefined): string {
  if (!width) return "";
  return WIDTH_CLASS_MAP[width] ?? "";
}

/**
 * Crea una copia del query conservando su prototipo (subclase concreta)
 * y todos los campos enumerables. Utilizado por el UiTable cuando un
 * usuario interactua con sort/search/pageSize: nunca muta el query
 * del padre directamente, sino que clona, muta el clon y emite el
 * `(queryChange)` para que el padre aplique el cambio sobre su signal.
 */
export function cloneQuery<T extends BaseQueryParams>(q: T): T {
  const cloned = Object.create(Object.getPrototypeOf(q));
  Object.assign(cloned, q);
  return cloned as T;
}

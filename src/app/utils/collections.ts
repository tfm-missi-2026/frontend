// Helpers de colecciones puras.
//
// La mayoria de los servicios FE construyen lookups (`Map<id, X>`)
// y ordenan listas con comparadores ad-hoc. Centralizamos esos
// patrones para que sean legibles, consistentes y reutilizables.

// --- Lookups ---

/**
 * Devuelve un `Map<key, item>` indexado por `keyFn(item)`. Si dos
 * items comparten la misma clave, gana el ultimo. Tipico uso:
 * resolver `id -> nombre` para no recorrer el array en cada lookup.
 */
export function indexBy<T, K>(items: Iterable<T>, keyFn: (item: T) => K): Map<K, T> {
  const out = new Map<K, T>();
  for (const item of items) {
    out.set(keyFn(item), item);
  }
  return out;
}

/**
 * Devuelve un `Map<key, item[]>` agrupando por `keyFn`. Conserva
 * el orden de insercion (los items en cada grupo mantienen el
 * orden del iterable original).
 */
export function groupBy<T, K>(
  items: Iterable<T>,
  keyFn: (item: T) => K,
): Map<K, T[]> {
  const out = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = out.get(key);
    if (list) list.push(item);
    else out.set(key, [item]);
  }
  return out;
}

// --- Ordenamiento ---

export type SortKey<T> = string | number | boolean | null | undefined;
export type KeyExtractor<T> = (item: T) => SortKey<T>;

/**
 * Compara dos keys segun su tipo. Nullish al fondo. Strings via
 * `localeCompare`, numeros restando, booleanos como 0/1.
 */
export function compareKeys<T>(a: SortKey<T>, b: SortKey<T>): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  return String(a).localeCompare(String(b), "es", { numeric: true });
}

/**
 * Devuelve una copia ordenada ascendente por `keyFn`. No muta el
 * iterable original.
 */
export function sortBy<T>(items: ReadonlyArray<T>, keyFn: KeyExtractor<T>): T[] {
  return [...items].sort((a, b) => compareKeys(keyFn(a), keyFn(b)));
}

/**
 * Variante descendente de `sortBy`.
 */
export function sortByDesc<T>(
  items: ReadonlyArray<T>,
  keyFn: KeyExtractor<T>,
): T[] {
  return [...items].sort((a, b) => compareKeys(keyFn(b), keyFn(a)));
}

// --- Secuencias ---

/**
 * `[1, 2, ..., n]`. Util para paginacion `Array.from({length: n})`
 * sin la verbosidad. `range(0)` devuelve `[]`.
 */
export function range(n: number): number[] {
  if (n <= 0) return [];
  const out: number[] = new Array(n);
  for (let i = 0; i < n; i++) out[i] = i + 1;
  return out;
}

// --- Fechas ISO ---

/**
 * Comparador ascendente sobre fechas ISO (`YYYY-MM-DD` o timestamp
 * ISO-8601). Compara lexicograficamente, que coincide con orden
 * cronologico. Si los strings no son ISO, cae a `localeCompare`.
 */
export function compareIsoDateAsc(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function compareIsoDateDesc(a: string, b: string): number {
  return a < b ? 1 : a > b ? -1 : 0;
}

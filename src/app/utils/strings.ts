// Helpers de strings para busqueda libre y normalizacion.

/**
 * Normaliza para busqueda case-insensitive: trim + lowercase.
 * Mantener unico punto de entrada evita inconsistencias
 * (`trim().toLowerCase()` vs `toLowerCase().trim()` vs olvidar el trim).
 */
export function normalize(value: string | null | undefined): string {
  if (value == null) return "";
  return value.trim().toLowerCase();
}

/**
 * True si `term` (ya normalizado o crudo) aparece en cualquiera de
 * `haystack`. Si el caller ya normalizo el term, el helper tambien
 * lo acepta tal cual — evita doble trabajo en loops calientes.
 */
export function matchesSearch(
  term: string,
  ...haystack: Array<string | null | undefined>
): boolean {
  const t = term.trim().toLowerCase();
  if (!t) return true;
  for (const raw of haystack) {
    if (raw == null) continue;
    if (raw.toLowerCase().includes(t)) return true;
  }
  return false;
}

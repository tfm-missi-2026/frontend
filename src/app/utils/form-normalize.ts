/**
 * Normaliza un valor de formulario string:
 *  - devuelve `undefined` si esta vacio o solo whitespace
 *  - devuelve `value.trim()` si hay contenido
 *
 * Pensado para mapear campos opcionales de UI a payloads de API
 * donde `""` no es valido pero `undefined` si.
 */
export function trimOrUndefined(value: string | null | undefined): string | undefined {
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Trim + uppercase. Usado para codigos de dominio (rol.codigo,
 * modulo.codigo, modulo.seccion) que el backend espera normalizados.
 */
export function normalizeCodigo(value: string | null | undefined): string {
  return (value ?? "").trim().toUpperCase();
}

/**
 * Trim de todos los campos string de un objeto. No muta el input.
 */
export function trimStrings<T extends Record<string, unknown>>(input: T): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string") {
      out[key] = value.trim();
    } else {
      out[key] = value;
    }
  }
  return out as T;
}
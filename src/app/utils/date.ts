// Helpers de fechas compartidos.
//
// Convenciones del proyecto:
// - Las fechas via API llegan como ISO-8601 (`YYYY-MM-DD` para fechas
//   puras, `OffsetDateTime` para timestamps con zona). Solo manejamos
//   la parte fecha (`YYYY-MM-DD`); si llega un timestamp, el caller
//   debe recortarlo primero.
// - Para mostrar al usuario usamos formato corto `DD/MM/YYYY`. Esto
//   evita arrastrar la libreria `Intl` (locale inconsistente) y
//   matchea el resto del diseno.
// - Para mandar al backend, siempre serializamos como `YYYY-MM-DD`.

export const EMPTY_DATE = "—";
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * `YYYY-MM-DD` → `Date` en zona local (medianoche). Devuelve `null`
 * si el string no es una fecha ISO valida. No tira excepciones.
 */
export function parseIsoDate(iso: string | null | undefined): Date | null {
  if (!iso || !ISO_DATE_RE.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * `Date` → `YYYY-MM-DD` (formato wire con el backend).
 */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Hoy como `YYYY-MM-DD`. Wrapper legible sobre `toIsoDate(new Date())`.
 */
export function todayIso(): string {
  return toIsoDate(new Date());
}

/**
 * True si el string cumple el patron `YYYY-MM-DD`.
 */
export function isIsoDate(value: string | null | undefined): value is string {
  return typeof value === "string" && ISO_DATE_RE.test(value);
}

/**
 * `YYYY-MM-DD` → `DD/MM/YYYY`. Si el valor no es ISO, lo devuelve
 * sin transformar (defensa). `null`/`undefined` → `—`.
 */
export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return EMPTY_DATE;
  if (!ISO_DATE_RE.test(iso)) return iso;
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/**
 * Variante que tolera `string | null` y devuelve `null` cuando el
 * caller prefiere propagar el vacio hacia arriba (p.ej. tablas con
 * filtro de fechas).
 */
export function formatShortDateOrNull(iso: string | null): string | null {
  if (!iso) return null;
  if (!ISO_DATE_RE.test(iso)) return iso;
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/**
 * Rango de fechas como `DD/MM/YYYY – DD/MM/YYYY`. Si `end` falta,
 * muestra solo el inicio.
 */
export function formatDateRange(
  fromIso: string | null | undefined,
  toIso: string | null | undefined,
): string {
  const a = formatShortDate(fromIso);
  const b = formatShortDate(toIso);
  return toIso ? `${a} – ${b}` : a;
}

/**
 * Recorta la parte fecha (`YYYY-MM-DD`) de un timestamp ISO. Los
 * timestamps del backend vienen como `OffsetDateTime` (e.g.
 * `2026-05-12T14:30:00Z`); aca solo queremos la fecha calendario.
 */
export function isoDateOnly(value: string | null | undefined): string {
  if (!value) return "";
  return value.length >= 10 ? value.slice(0, 10) : value;
}

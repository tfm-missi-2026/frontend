// Generadores aleatorios criptograficamente seguros.
//
// Donde antes se usaba `Math.random()` para passwords o sufijos de
// tokens, preferimos `crypto.getRandomValues()`: no es predecible
// y no falla en workers/test runners donde `Math.random` puede
// estar parcheado.

const ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

/**
 * String aleatorio de `length` caracteres tomados de `alphabet`
 * (default: alfanumerico sin ambiguos). Usa Web Crypto.
 */
export function randomToken(
  length: number,
  alphabet: string = ALPHABET,
): string {
  if (length <= 0) return "";
  if (typeof crypto === "undefined" || !crypto.getRandomValues) {
    // Fallback muy raro (SSR / tests sin crypto). No es CSPRNG
    // pero es mejor que tirar la app.
    let out = "";
    for (let i = 0; i < length; i++) {
      out += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return out;
  }
  const out: string[] = new Array(length);
  const buf = new Uint32Array(length);
  crypto.getRandomValues(buf);
  for (let i = 0; i < length; i++) {
    out[i] = alphabet.charAt(buf[i] % alphabet.length);
  }
  return out.join("");
}

/**
 * Contrasena temporal legible (formato `XXXX-XXXX`). Pensada para
 * sugerir al admin un valor que puede copiar al portapapeles hasta
 * que el backend exponga un endpoint real de reset.
 */
export function generateSecurePassword(length = 8): string {
  const raw = randomToken(length);
  const mid = Math.ceil(raw.length / 2);
  return `${raw.slice(0, mid)}-${raw.slice(mid)}`;
}

/**
 * Sufijo corto (default 12 chars) usando el alfabeto sin ambiguos.
 * Pensado para claves de UI / ids de formularios en memoria.
 */
export function tokenSuffix(length = 12): string {
  return randomToken(length);
}

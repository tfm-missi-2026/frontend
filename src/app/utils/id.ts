// Helpers de identificadores.
//
// Web Crypto ya ofrece `randomUUID()` y un par de helpers para
// tokens cortos son suficiente para los casos de uso del proyecto
// (claves de UI, ids de formularios en memoria).

/**
 * UUID v4 criptograficamente aleatorio. Equivalente a
 * `crypto.randomUUID()` envuelto para fallback determinista en
 * entornos sin Web Crypto.
 */
export function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback solo para SSR/tests sin crypto. No es v4 estricto,
  // pero alcanza como placeholder.
  const r = (n: number) =>
    Math.floor(Math.random() * Math.pow(16, n))
      .toString(16)
      .padStart(n, "0");
  return `${r(8)}-${r(4)}-${r(4)}-${r(4)}-${r(12)}`;
}

import { randomToken } from "./random";

/**
 * Sufijo corto (default 8 chars) usando el alfabeto sin ambiguos
 * de `utils/random.ts`. Pensado para keys de *ngFor / trackBy
 * cuando el item no tiene un id estable.
 */
export function shortId(length = 8): string {
  return randomToken(length);
}

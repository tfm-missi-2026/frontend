// Wrapper tipado sobre `localStorage` con manejo defensivo.
//
// `localStorage` puede lanzar `SecurityError` en modo incognito,
// `QuotaExceededError` si se llena, y los valores que el usuario
// deja pueden no parsear como JSON si otra version de la app
// guardo otro shape. Estas helpers centralizan la logica para que
// los servicios no se rompan en runtime.
//
// Todo se serializa como JSON. Si necesitas binario o nada
// serializable, usa `localStorage` directo.

export function readJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // QuotaExceededError o SecurityError (incognito). El caller
    // puede no enterarse; si necesita garantia de persistencia
    // debe chequear via `readJson` despues.
  }
}

export function removeItem(key: string): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // SecurityError en incognito. No hacer nada.
  }
}

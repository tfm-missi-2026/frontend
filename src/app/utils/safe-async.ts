import { firstValueFrom, Observable } from "rxjs";

import { extractProblemMessage } from "./problem-detail";

export interface SafeCallOptions {
  fallback?: string;
}

/**
 * Resuelve un Observable a Promise capturando el error con
 * `extractProblemMessage` y delegando al callback `onError`. Devuelve
 * `null` cuando falla. Usar en servicios que exponen
 * `_error.set(extractProblemMessage(err))` desde varios metodos.
 */
export async function safeFirstValueFrom<T>(
  source: Observable<T>,
  onError: (msg: string) => void,
  options?: SafeCallOptions,
): Promise<T | null> {
  try {
    return await firstValueFrom(source);
  } catch (err) {
    onError(extractProblemMessage(err, options?.fallback));
    return null;
  }
}
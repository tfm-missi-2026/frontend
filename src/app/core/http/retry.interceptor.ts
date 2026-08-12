import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { retry, timer } from "rxjs";

import { environment } from "@env/environment";

const RETRY_DELAY_MS = 5000;

// Reintento acotado para errores de red (status 0: backend caido, CORS
// bloqueado, DNS, etc.). No reintenta mutaciones (POST/PUT/DELETE) para
// no duplicar efectos secundarios en el backend, ni respuestas HTTP 4xx
// que ya son decisiones del servidor. Al agotar `httpRetryCount`, el
// error se propaga al `errorInterceptor`, que muestra el toast final.
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const method = req.method.toUpperCase();
  const esLectura =
    method === "GET" || method === "HEAD" || method === "OPTIONS";
  if (!esLectura) return next(req);

  const maxRetries = environment.httpRetryCount ?? 0;

  return next(req).pipe(
    retry({
      count: maxRetries,
      delay: (error: unknown, _retryCount: number) => {
        const esErrorRed =
          error instanceof HttpErrorResponse &&
          error.status === 0 &&
          !error.ok;
        if (!esErrorRed) {
          throw error;
        }
        return timer(RETRY_DELAY_MS);
      },
    }),
  );
};

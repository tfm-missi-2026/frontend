import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

// Mapeo de los codigos ProblemDetail (RFC 7807) que devuelve
// ms-administracion / ms-proyectos / ms-seguimiento a algo
// consumible por la UI. Ver CLAUDE.md raiz §"Formato de errores".

export interface ApiProblem {
  code: string;
  status: number;
  detail: string;
  errors?: Array<{ campo: string; mensaje: string }>;
  instance?: string;
  timestamp?: string;
}

const KNOWN_CODES = new Set<string>([
  "VALIDACION_FALLIDA",
  "CREDENCIALES_INVALIDAS",
  "USUARIO_DESHABILITADO",
  "ACCESO_DENEGADO",
  "RECURSO_NO_ENCONTRADO",
  "CONFLICTO_NEGOCIO",
  "CONFLICTO_INTEGRIDAD",
  "ERROR_INTERNO",
]);

// Paths que no muestran toast porque el caller los maneja (login, etc.)
// o son pings de salud.
const SILENT_PATHS = ["/api/auth/login", "/api/ping", "/api/ping/secure"];

export function parseProblem(error: HttpErrorResponse): ApiProblem | null {
  const body = error.error;
  if (!body || typeof body !== "object") return null;

  const code = typeof body.title === "string" ? body.title : "ERROR_INTERNO";
  const detail = typeof body.detail === "string" ? body.detail : error.message;
  const errors = Array.isArray(body.errors) ? body.errors : undefined;

  return {
    code: KNOWN_CODES.has(code) ? code : "ERROR_INTERNO",
    status: error.status,
    detail,
    errors,
    instance: typeof body.instance === "string" ? body.instance : undefined,
    timestamp: typeof body.timestamp === "string" ? body.timestamp : undefined,
  };
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((raw: unknown) => {
      const err = raw instanceof HttpErrorResponse ? raw : null;
      if (!err) return throwError(() => raw);
      const isSilent = SILENT_PATHS.some((p) => req.url.includes(p));
      if (!isSilent && err.status === 0) {
        // Sin respuesta del servidor (red caida, gateway caido, CORS
        // bloqueado). `retryInterceptor` ya agoto sus reintentos; aca
        // solo notificamos al usuario una vez.
        void import("./toast.service").then(({ ToastService }) => {
          try {
            inject(ToastService).error(
              "No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.",
              "Sin conexión",
            );
          } catch {
            // Si ToastService no esta disponible (ej. tests), noop.
          }
        });
      }
      const problem = parseProblem(err);
      if (problem && !isSilent && err.status !== 0) {
        // Lazy import para no romper el bootstrap si ngx-toastr no esta listo.
        void import("./toast.service").then(({ ToastService }) => {
          try {
            inject(ToastService).showProblem(problem);
          } catch {
            // Si ToastService no esta disponible (ej. tests), noop.
          }
        });
      }
      // 401 ya lo maneja jwtInterceptor (limpia sesion). Si llega aca,
      // es porque no estaba autenticado y entro a un endpoint protegido.
      if (err.status === 401 && !req.url.includes("/api/auth/login")) {
        router.navigate(["/signin"]);
      }
      return throwError(() => err);
    }),
  );
};

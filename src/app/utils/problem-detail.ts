// Helper para extraer el mensaje legible de un error HTTP.
//
// El backend responde errores como `ProblemDetail` (RFC 7807):
//   { type, title, status, detail, instance, code, ... }
// Para mostrarlos en UI/toast preferimos `detail` (mas especifico) y
// caemos a `title` si no hay. Si el error no es HTTP (e.g. el `throw`
// nativo de JS), devolvemos su `.message`. Si no hay nada legible,
// devolvemos un fallback configurado por el caller.
//
// Centralizar esta logica evita que cada servicio tenga su propio
// `extraerMensaje(err)` con bugs sutiles (orden de fallback, tipos
// del body, etc.).

interface ProblemDetailLike {
  detail?: string;
  title?: string;
}

interface HttpErrorLike {
  error?: ProblemDetailLike;
}

export function extractProblemMessage(
  err: unknown,
  fallback = "Error inesperado",
): string {
  if (err && typeof err === "object") {
    const body = (err as HttpErrorLike).error;
    if (body?.detail) return body.detail;
    if (body?.title) return body.title;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

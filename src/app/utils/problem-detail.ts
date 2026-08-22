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
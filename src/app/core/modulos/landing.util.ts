import type { ModuloResponse } from "./modulo.models";
import { resolverRegistroModulo } from "./modulo.registry";

export interface LandingContext {
  paginaInicioCodigo?: string | null;
  modulos: ModuloResponse[];
}

/**
 * Ruta de inicio del rol tras el login (y destino al denegar acceso).
 * 1. Usa el `paginaInicioCodigo` configurado en el rol (viene en el login).
 * 2. Si falta o no tiene pagina registrada, cae a la primera pagina MENU
 *    implementada del rol.
 * 3. Ultimo recurso: el dashboard (INICIO).
 */
export function computarRutaLanding(ctx: LandingContext): string {
  if (ctx.paginaInicioCodigo) {
    const registro = resolverRegistroModulo(ctx.paginaInicioCodigo);
    if (registro) return registro.path;
  }
  const primerModulo = ctx.modulos
    .filter((m) => m.estado === 1 && m.tipo !== "SECTION")
    .map((m) => resolverRegistroModulo(m.codigo))
    .find((r) => r !== undefined);
  if (primerModulo) return primerModulo.path;
  return "/app/operacion/dashboard";
}
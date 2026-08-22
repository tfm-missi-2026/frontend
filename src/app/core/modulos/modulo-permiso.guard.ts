import { inject } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";

import { AuthService } from "@core/auth/auth.service";
import { ModulosService } from "@core/modulos/modulos.service";

import { computarRutaLanding } from "./landing.util";

/**
 * Guard por modulo (RBAC del backend). Cada ruta del segmento /app que
 * requiere un modulo declara `data: { moduloCodigo }`. El guard:
 *   1. Si la ruta no exige modulo, permite (return true).
 *   2. Asegura que los modulos del rol activo esten cargados.
 *   3. Si el rol no tiene el modulo (o estado != 1), redirige a la pagina
 *      de inicio del rol (fail-closed; nunca queda en una pantalla sin acceso).
 */
export const moduloPermisoGuard: CanMatchFn = async (route) => {
  const codigo = route.data?.["moduloCodigo"] as string | undefined;
  if (!codigo) return true;

  const auth = inject(AuthService);
  const modulos = inject(ModulosService);
  const router = inject(Router);

  const rolId = auth.rolId();
  if (!rolId) return router.createUrlTree(["/signin"]);

  if (!modulos.tieneDatos()) {
    await modulos.cargar(rolId);
  }

  if (!modulos.tieneModulo(codigo)) {
    const path = computarRutaLanding({
      paginaInicioCodigo: auth.usuario()?.rol?.paginaInicioCodigo,
      modulos: modulos.modulos(),
    });
    return router.createUrlTree([path]);
  }
  return true;
};
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { AuthService } from "@core/auth/auth.service";
import { ModulosService } from "@core/modulos/modulos.service";

import { computarRutaLanding } from "./landing.util";

/**
 * Resuelve la ruta de inicio del rol para la raiz de /app (y al recargar
 * en /app). Devuelve un UrlTree a la pagina de inicio configurada del rol
 * (o la primera pagina implementada como fallback).
 */
export const landingGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const modulos = inject(ModulosService);
  const router = inject(Router);

  const rolId = auth.rolId();
  if (!rolId) return router.createUrlTree(["/signin"]);

  if (!modulos.tieneDatos()) {
    await modulos.cargar(rolId);
  }

  const path = computarRutaLanding({
    paginaInicioCodigo: auth.usuario()?.rol?.paginaInicioCodigo,
    modulos: modulos.modulos(),
  });
  return router.createUrlTree([path]);
};
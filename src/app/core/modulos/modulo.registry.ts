export type ModuloCodigo =
  | "INICIO"
  | "PROYECTOS"
  | "BITACORA"
  | "ASIGNACIONES"
  | "VARIACIONES"
  | "DASHBOARD_JEFE"
  | "DASHBOARD_RECURSO"
  | "CARGA_EQUIPO"
  | "AVANCE"
  | "USUARIOS"
  | "ROLES"
  | "CATALOGO"
  | "MODULOS"
  | "CONFIGURACION";

export interface ModuloRegistro {
  path: string;
  title?: string;
}

/**
 * Unica fuente de navegabilidad del SPA. Cada modulo del backend
 * (msa_modulo.codigo) que tiene pagina implementada se resuelve aqui.
 * Si un codigo no esta en este registro, el sidebar lo omite (con warn
 * en dev) y el guard no puede autorizar su ruta.
 *
 * `path` es absoluto dentro del segmento /app (matchea con la ruta
 * compuesta por extractPathsFromRoutes desde app.routes.ts).
 */
export const MODULO_REGISTRY = {
  INICIO: { path: "/app/operacion/dashboard", title: "Dashboard del Gestor" },
  PROYECTOS: { path: "/app/operacion/proyectos", title: "Proyectos" },
  BITACORA: { path: "/app/seguimiento/mi-bitacora", title: "Mi bitácora" },
  ASIGNACIONES: { path: "/app/operacion/planificacion", title: "Planificación" },
  VARIACIONES: { path: "/app/operacion/variaciones", title: "Variaciones" },
  DASHBOARD_JEFE: { path: "/app/operacion/dashboard-jefe", title: "Dashboard del Jefe de Área" },
  DASHBOARD_RECURSO: { path: "/app/operacion/dashboard-recurso", title: "Dashboard del Recurso Técnico" },
  CARGA_EQUIPO: { path: "/app/operacion/carga-equipo", title: "Carga del equipo" },
  AVANCE: { path: "/app/operacion/avance", title: "Avance" },
  USUARIOS: { path: "/app/administracion/usuarios", title: "Gestión de usuarios" },
  ROLES: { path: "/app/administracion/roles", title: "Roles y Permisos" },
  CATALOGO: { path: "/app/administracion/catalogo", title: "Catálogo" },
  MODULOS: { path: "/app/administracion/modulos", title: "Módulos del sistema" },
  CONFIGURACION: { path: "/app/cuenta/configuracion", title: "Configuración" },
} as const satisfies Record<ModuloCodigo, ModuloRegistro>;

export function resolverRegistroModulo(
  codigo: string,
): ModuloRegistro | undefined {
  return (MODULO_REGISTRY as Record<string, ModuloRegistro | undefined>)[codigo];
}
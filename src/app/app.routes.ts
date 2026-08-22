import type { Routes } from "@angular/router";

import { NotImplementedPageComponent } from "./features/users/pages/not-implemented/not-implemented.component";
import { UsersListComponent } from "./features/users/pages/users-list/users-list.component";
import { authGuard } from "@core/auth/auth.guard";
import { landingGuard } from "@core/modulos/landing.guard";
import { LandingRedirectComponent } from "@core/modulos/landing-redirect/landing-redirect.component";
import { moduloPermisoGuard } from "@core/modulos/modulo-permiso.guard";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "signin",
  },
  {
    path: "",
    loadChildren: () =>
      import("./features/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "app",
    canActivate: [authGuard],
    loadComponent: () =>
      import("@shared/layout/app-layout/app-layout.component").then(
        (m) => m.AppLayoutComponent,
      ),
    children: [
      {
        path: "",
        pathMatch: "full",
        canActivate: [landingGuard],
        component: LandingRedirectComponent,
      },
      {
        path: "operacion/dashboard",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "INICIO" },
        loadChildren: () =>
          import(
            "@features/manager-dashboard/manager-dashboard.module"
          ).then((m) => m.ManagerDashboardModule),
        title: "SPSRT — Dashboard del Gestor",
      },
      {
        path: "operacion/dashboard-jefe",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "DASHBOARD_JEFE" },
        loadChildren: () =>
          import("@features/area-dashboard/area-dashboard.module").then(
            (m) => m.AreaDashboardModule,
          ),
        title: "SPSRT — Dashboard del Jefe de Área",
      },
      {
        path: "operacion/dashboard-recurso",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "DASHBOARD_RECURSO" },
        loadChildren: () =>
          import(
            "@features/resource-dashboard/resource-dashboard.module"
          ).then((m) => m.ResourceDashboardModule),
        title: "SPSRT — Dashboard del Recurso Técnico",
      },
      {
        path: "administracion/usuarios",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "USUARIOS" },
        component: UsersListComponent,
        title: "SPSRT — Gestión de usuarios",
      },
      {
        path: "administracion/roles",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "ROLES" },
        loadChildren: () =>
          import("@features/roles-permissions/roles-permissions.module").then(
            (m) => m.RolesPermissionsModule,
          ),
        title: "SPSRT — Roles y Permisos",
      },
      {
        path: "administracion/catalogo",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "CATALOGO" },
        loadChildren: () =>
          import("@features/catalog/catalog.module").then(
            (m) => m.CatalogModule,
          ),
      },
      {
        path: "seguimiento/mi-bitacora",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "BITACORA" },
        loadChildren: () =>
          import("@features/timesheet/timesheet.module").then(
            (m) => m.TimesheetModule,
          ),
        title: "SPSRT — Mi bitácora",
      },
      {
        path: "operacion/proyectos",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "PROYECTOS" },
        loadChildren: () =>
          import("@features/projects/projects.module").then(
            (m) => m.ProjectsModule,
          ),
        title: "SPSRT — Proyectos",
      },
      {
        path: "operacion/planificacion",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "ASIGNACIONES" },
        loadChildren: () =>
          import("@features/planning/planning.module").then(
            (m) => m.PlanningModule,
          ),
        title: "SPSRT — Planificación",
      },
      {
        path: "operacion/variaciones",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "VARIACIONES" },
        loadChildren: () =>
          import("@features/variations/variations.module").then(
            (m) => m.VariationsModule,
          ),
        title: "SPSRT — Variaciones",
      },
      {
        path: "operacion/carga-equipo",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "CARGA_EQUIPO" },
        loadChildren: () =>
          import("@features/team-load/team-load.module").then(
            (m) => m.TeamLoadModule,
          ),
        title: "SPSRT — Carga del equipo",
      },
      {
        path: "operacion/avance",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "AVANCE" },
        loadChildren: () =>
          import("@features/progress/progress.module").then(
            (m) => m.ProgressModule,
          ),
        title: "SPSRT — Avance",
      },
      {
        path: "administracion/modulos",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "MODULOS" },
        loadChildren: () =>
          import("@features/modulos/modulos-admin.module").then(
            (m) => m.ModulosAdminModule,
          ),
        title: "SPSRT — Módulos del sistema",
      },
      {
        path: "cuenta/configuracion",
        canMatch: [moduloPermisoGuard],
        data: { moduloCodigo: "CONFIGURACION" },
        component: NotImplementedPageComponent,
        title: "SPSRT — Configuración",
      },
    ],
  },
  {
    path: "**",
    component: NotImplementedPageComponent,
    title: "SPSRT — Página no encontrada",
  },
];
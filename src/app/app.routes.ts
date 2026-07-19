import type { Routes } from "@angular/router";

import { NotFoundComponent } from "./pages/other-page/not-found/not-found.component";
import { NotImplementedPageComponent } from "./features/users/pages/not-implemented/not-implemented.component";
import { UsersListComponent } from "./features/users/pages/users-list/users-list.component";
import { authGuard } from "@core/auth/auth.guard";

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
        redirectTo: "administracion/usuarios",
      },
      {
        path: "operacion/dashboard",
        loadChildren: () =>
          import(
            "@features/manager-dashboard/manager-dashboard.module"
          ).then((m) => m.ManagerDashboardModule),
        title: "SPSRT — Dashboard del Gestor",
      },
      {
        path: "operacion/dashboard-jefe",
        loadChildren: () =>
          import("@features/area-dashboard/area-dashboard.module").then(
            (m) => m.AreaDashboardModule,
          ),
        title: "SPSRT — Dashboard del Jefe de Área",
      },
      {
        path: "operacion/dashboard-recurso",
        loadChildren: () =>
          import(
            "@features/resource-dashboard/resource-dashboard.module"
          ).then((m) => m.ResourceDashboardModule),
        title: "SPSRT — Dashboard del Recurso Técnico",
      },
      {
        path: "administracion/usuarios",
        component: UsersListComponent,
        title: "SPSRT — Gestión de usuarios",
      },
      {
        path: "administracion/roles",
        loadChildren: () =>
          import("@features/roles-permissions/roles-permissions.module").then(
            (m) => m.RolesPermissionsModule,
          ),
        title: "SPSRT — Roles y Permisos",
      },
      {
        path: "administracion/catalogo",
        loadChildren: () =>
          import("@features/catalog/catalog.module").then(
            (m) => m.CatalogModule,
          ),
      },
      {
        path: "seguimiento/mi-bitacora",
        loadChildren: () =>
          import("@features/timesheet/timesheet.module").then(
            (m) => m.TimesheetModule,
          ),
        title: "SPSRT — Mi bitácora",
      },
      {
        path: "operacion/proyectos",
        loadChildren: () =>
          import("@features/projects/projects.module").then(
            (m) => m.ProjectsModule,
          ),
        title: "SPSRT — Proyectos",
      },
      {
        path: "operacion/planificacion",
        loadChildren: () =>
          import("@features/planning/planning.module").then(
            (m) => m.PlanningModule,
          ),
        title: "SPSRT — Planificación",
      },
      {
        path: "operacion/variaciones",
        loadChildren: () =>
          import("@features/variations/variations.module").then(
            (m) => m.VariationsModule,
          ),
        title: "SPSRT — Variaciones",
      },
      {
        path: "operacion/carga-equipo",
        loadChildren: () =>
          import("@features/team-load/team-load.module").then(
            (m) => m.TeamLoadModule,
          ),
        title: "SPSRT — Carga del equipo",
      },
      {
        path: "operacion/avance",
        loadChildren: () =>
          import("@features/progress/progress.module").then(
            (m) => m.ProgressModule,
          ),
        title: "SPSRT — Avance",
      },
      {
        path: "administracion/modulos",
        component: NotImplementedPageComponent,
        title: "SPSRT — Módulos",
      },
      {
        path: "cuenta/configuracion",
        component: NotImplementedPageComponent,
        title: "SPSRT — Configuración",
      },
    ],
  },
  {
    path: "**",
    component: NotFoundComponent,
    title: "SPSRT — Página no encontrada",
  },
];

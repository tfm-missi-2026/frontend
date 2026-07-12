import type { Routes } from "@angular/router";

import { NotFoundComponent } from "./pages/other-page/not-found/not-found.component";
import { NotImplementedPageComponent } from "./features/users/pages/not-implemented/not-implemented.component";
import { UsersListComponent } from "./features/users/pages/users-list/users-list.component";

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

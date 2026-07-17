import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NotImplementedPageComponent } from "./pages/not-implemented/not-implemented.component";
import { UsersListComponent } from "./pages/users-list/users-list.component";

const routes: Routes = [
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
    loadComponent: () =>
      import("./pages/not-implemented/not-implemented.component").then(
        (m) => m.NotImplementedPageComponent,
      ),
    title: "SPSRT — Roles",
  },
  {
    path: "administracion/catalogo",
    loadComponent: () =>
      import("./pages/not-implemented/not-implemented.component").then(
        (m) => m.NotImplementedPageComponent,
      ),
    title: "SPSRT — Catálogo",
  },
  {
    path: "administracion/modulos",
    loadComponent: () =>
      import("./pages/not-implemented/not-implemented.component").then(
        (m) => m.NotImplementedPageComponent,
      ),
    title: "SPSRT — Módulos",
  },
  {
    path: "cuenta/configuracion",
    loadComponent: () =>
      import("./pages/not-implemented/not-implemented.component").then(
        (m) => m.NotImplementedPageComponent,
      ),
    title: "SPSRT — Configuración",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
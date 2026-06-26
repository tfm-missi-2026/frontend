import type { Routes } from "@angular/router";

import { authGuard } from "@core/auth/auth.guard";

import { NotFoundComponent } from "./pages/other-page/not-found/not-found.component";

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
    loadChildren: () =>
      import("./features/users/users.module").then((m) => m.UsersModule),
  },
  {
    path: "**",
    component: NotFoundComponent,
    title: "SPSRT — Página no encontrada",
  },
];

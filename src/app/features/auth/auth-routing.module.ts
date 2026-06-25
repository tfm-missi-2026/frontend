import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthLayoutComponent } from "@shared/layout/auth-layout/auth-layout.component";

const routes: Routes = [
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "signin",
      },
      {
        path: "signin",
        loadComponent: () =>
          import("./pages/sign-in/sign-in.component").then(
            (m) => m.SignInComponent,
          ),
        title: "SPSRT — Iniciar sesión",
      },
      {
        path: "signup",
        loadComponent: () =>
          import("./pages/sign-up/sign-up.component").then(
            (m) => m.SignUpComponent,
          ),
        title: "SPSRT — Crear cuenta",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}

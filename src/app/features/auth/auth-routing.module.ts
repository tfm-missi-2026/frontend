import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SignInComponent } from "./pages/sign-in/sign-in.component";
import { SignUpComponent } from "./pages/sign-up/sign-up.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "signin",
  },
  {
    path: "signin",
    component: SignInComponent,
    title: "Angular Sign In Dashboard | TailAdmin - Angular Admin Dashboard Template",
  },
  {
    path: "signup",
    component: SignUpComponent,
    title: "Angular Sign Up Dashboard | TailAdmin - Angular Admin Dashboard Template",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
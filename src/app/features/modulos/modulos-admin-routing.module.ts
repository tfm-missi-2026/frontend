import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ModulosAdminListComponent } from "./pages/modulos-admin-list/modulos-admin-list.component";

const routes: Routes = [
  {
    path: "",
    component: ModulosAdminListComponent,
    title: "SPSRT — Modulos del sistema",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulosAdminRoutingModule {}
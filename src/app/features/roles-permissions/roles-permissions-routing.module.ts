import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RolesListComponent } from "./pages/roles-list/roles-list.component";

const routes: Routes = [
  {
    path: "",
    component: RolesListComponent,
    title: "SPSRT — Roles y Permisos",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesPermissionsRoutingModule {}

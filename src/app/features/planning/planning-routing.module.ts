import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PlanningListComponent } from "./pages/planning-list/planning-list.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () =>
      import("./pages/planning-list/planning-list.component").then(
        (m) => m.PlanningListComponent,
      ),
    title: "SPSRT — Planificación",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanningRoutingModule {}
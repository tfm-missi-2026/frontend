import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () =>
      import("./pages/variations-list/variations-list.component").then(
        (m) => m.VariationsListComponent,
      ),
    title: "SPSRT — Variaciones",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VariationsRoutingModule {}

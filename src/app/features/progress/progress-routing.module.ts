import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () =>
      import("./pages/progress-list/progress-list.component").then(
        (m) => m.ProgressListComponent,
      ),
    title: "SPSRT — Avance",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgressRoutingModule {}

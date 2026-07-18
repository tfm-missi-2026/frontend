import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () =>
      import("./pages/team-load-list/team-load-list.component").then(
        (m) => m.TeamLoadListComponent,
      ),
    title: "SPSRT — Carga del equipo",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamLoadRoutingModule {}

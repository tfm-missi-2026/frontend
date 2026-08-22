import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () =>
      import("./pages/area-dashboard-page/area-dashboard-page.component").then(
        (m) => m.AreaDashboardPageComponent,
      ),
    title: "SPSRT — Dashboard del Jefe de Área",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaDashboardRoutingModule {}

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () =>
      import(
        "./pages/manager-dashboard-page/manager-dashboard-page.component"
      ).then((m) => m.ManagerDashboardPageComponent),
    title: "SPSRT — Dashboard del Gestor",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerDashboardRoutingModule {}

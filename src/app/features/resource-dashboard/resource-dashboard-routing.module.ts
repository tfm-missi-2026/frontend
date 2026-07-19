import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ResourceDashboardPageComponent } from "./pages/resource-dashboard-page/resource-dashboard-page.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: ResourceDashboardPageComponent,
    title: "SPSRT — Dashboard del Recurso Técnico",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceDashboardRoutingModule {}
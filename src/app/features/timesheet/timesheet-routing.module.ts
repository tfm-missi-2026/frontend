import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { MyTimesheetComponent } from "./pages/my-timesheet/my-timesheet.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "seguimiento/mi-bitacora",
  },
  {
    path: "seguimiento/mi-bitacora",
    component: MyTimesheetComponent,
    title: "SPSRT — Mi bitácora",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimesheetRoutingModule {}
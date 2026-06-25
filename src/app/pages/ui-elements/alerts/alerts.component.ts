import { Component } from "@angular/core";
import { UiAlertComponent } from "@shared/ui/alert";
import { CommonComponentCardComponent } from "../../../shared/common/component-card";
import { CommonBreadcrumbComponent } from "../../../shared/common/page-breadcrumb";

@Component({
  selector: "app-alerts",
  imports: [UiAlertComponent, CommonComponentCardComponent, CommonBreadcrumbComponent],
  templateUrl: "./alerts.component.html",
  styles: ``,
})
export class AlertsComponent {}

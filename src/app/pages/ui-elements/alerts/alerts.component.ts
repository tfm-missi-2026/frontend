import { Component } from "@angular/core";
import { UiAlertComponent } from "@shared/ui/alert";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";

@Component({
  selector: "app-alerts",
  imports: [UiAlertComponent, ComponentCardComponent, PageBreadcrumbComponent],
  templateUrl: "./alerts.component.html",
  styles: ``,
})
export class AlertsComponent {}

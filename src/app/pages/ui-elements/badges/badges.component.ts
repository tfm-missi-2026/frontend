import { Component } from "@angular/core";
import { CommonBreadcrumbComponent } from "../../../shared/common/page-breadcrumb";
import { CommonComponentCardComponent } from "../../../shared/common/component-card";
import { UiBadgeComponent } from "@shared/ui/badge";
import { IconPlusComponent } from "@shared/icons";

@Component({
  selector: "app-badges",
  imports: [CommonBreadcrumbComponent, CommonComponentCardComponent, UiBadgeComponent],
  templateUrl: "./badges.component.html",
  styles: ``,
})
export class BadgesComponent {
  readonly plusIcon = IconPlusComponent;
}

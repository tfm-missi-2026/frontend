import { Component } from "@angular/core";
import { CommonComponentCardComponent } from "../../../shared/common/component-card";
import { CommonBreadcrumbComponent } from "../../../shared/common/page-breadcrumb";
import { UiButtonComponent } from "@shared/ui/button";
import { IconBoxComponent } from "@shared/icons";

@Component({
  selector: "app-buttons",
  imports: [CommonComponentCardComponent, CommonBreadcrumbComponent, UiButtonComponent],
  templateUrl: "./buttons.component.html",
  styles: ``,
})
export class ButtonsComponent {
  readonly boxIcon = IconBoxComponent;
}

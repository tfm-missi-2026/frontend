import { Component } from "@angular/core";
import { ComponentCardComponent } from "../../../shared/common/component-card/component-card.component";
import { PageBreadcrumbComponent } from "../../../shared/common/page-breadcrumb/page-breadcrumb.component";
import { UiButtonComponent } from "@shared/ui/button";
import { IconBoxComponent } from "@shared/icons";

@Component({
  selector: "app-buttons",
  imports: [ComponentCardComponent, PageBreadcrumbComponent, UiButtonComponent],
  templateUrl: "./buttons.component.html",
  styles: ``,
})
export class ButtonsComponent {
  readonly boxIcon = IconBoxComponent;
}

import { Component } from "@angular/core";
import { UiAvatarComponent } from "@shared/ui/avatar";
import { ComponentCardComponent } from "../../../shared/common/component-card/component-card.component";
import { PageBreadcrumbComponent } from "../../../shared/common/page-breadcrumb/page-breadcrumb.component";

@Component({
  selector: "app-avatar-element",
  imports: [UiAvatarComponent, ComponentCardComponent, PageBreadcrumbComponent],
  templateUrl: "./avatar-element.component.html",
  styles: ``,
})
export class AvatarElementComponent {}

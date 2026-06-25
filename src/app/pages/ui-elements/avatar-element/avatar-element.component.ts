import { Component } from "@angular/core";
import { UiAvatarComponent } from "@shared/ui/avatar";
import { CommonComponentCardComponent } from "../../../shared/common/component-card";
import { CommonBreadcrumbComponent } from "../../../shared/common/page-breadcrumb";

@Component({
  selector: "app-avatar-element",
  imports: [UiAvatarComponent, CommonComponentCardComponent, CommonBreadcrumbComponent],
  templateUrl: "./avatar-element.component.html",
  styles: ``,
})
export class AvatarElementComponent {}

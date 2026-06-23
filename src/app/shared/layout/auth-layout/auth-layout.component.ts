import { Component } from "@angular/core";
import { UiLinkComponent } from "@shared/ui/link";
import { UiImageComponent } from "@shared/ui/image";
import { CommonThemeToggleComponent } from "@shared/common/theme-toggle";
import { CommonGridShapeComponent } from "@shared/common/grid-shape";

@Component({
  selector: "AuthLayout",
  standalone: true,
  imports: [
    CommonThemeToggleComponent,
    CommonGridShapeComponent,
    UiLinkComponent,
    UiImageComponent,
  ],
  templateUrl: "./auth-layout.component.html",
  styles: ``,
})
export class AuthLayoutComponent {}

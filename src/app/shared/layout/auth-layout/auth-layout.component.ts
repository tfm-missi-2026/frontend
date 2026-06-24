import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { UiLinkComponent } from "@shared/ui/link";
import { UiImageComponent } from "@shared/ui/image";
import { CommonThemeToggleComponent } from "@shared/common/theme-toggle";
import { CommonGridShapeComponent } from "@shared/common/grid-shape";

@Component({
  selector: "AuthLayout",
  standalone: true,
  imports: [
    RouterOutlet,
    CommonThemeToggleComponent,
    CommonGridShapeComponent,
    UiLinkComponent,
    UiImageComponent,
  ],
  templateUrl: "./auth-layout.component.html",
  styles: ``,
})
export class AuthLayoutComponent {}

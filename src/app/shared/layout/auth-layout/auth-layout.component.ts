import { Component } from "@angular/core";
import { GridShapeComponent } from "../../common/grid-shape/grid-shape.component";
import { ThemeToggleTwoComponent } from "../../common/theme-toggle-two/theme-toggle-two.component";
import { UiLinkComponent } from "@shared/ui/link";
import { UiImageComponent } from "@shared/ui/image";

@Component({
  selector: "AuthLayout",
  standalone: true,
  imports: [
    GridShapeComponent,
    ThemeToggleTwoComponent,
    UiLinkComponent,
    UiImageComponent,
  ],
  templateUrl: "./auth-layout.component.html",
  styles: ``,
})
export class AuthLayoutComponent {}

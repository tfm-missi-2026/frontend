import { Component } from "@angular/core";
import { AuthLayoutComponent } from "../../../shared/layout/auth-layout/auth-layout";
import { SignupFormComponent } from "../../../shared/components/auth/signup-form/signup-form.component";

@Component({
  selector: "app-sign-up",
  imports: [AuthLayoutComponent, SignupFormComponent],
  templateUrl: "./sign-up.component.html",
  styles: ``,
})
export class SignUpComponent {}

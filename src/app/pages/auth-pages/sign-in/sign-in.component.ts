import { Component } from "@angular/core";
import { AuthLayoutComponent } from "../../../shared/layout/auth-layout/auth-layout";
import { SigninFormComponent } from "../../../shared/components/auth/signin-form/signin-form.component";

@Component({
  selector: "app-sign-in",
  imports: [AuthLayoutComponent, SigninFormComponent],
  templateUrl: "./sign-in.component.html",
  styles: ``,
})
export class SignInComponent {}

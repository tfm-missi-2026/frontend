import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Router } from "@angular/router";

import {
  SigninFormComponent,
  SignInFormData,
} from "../../components/signin-form/signin-form.component";

@Component({
  selector: "SignIn",
  standalone: true,
  imports: [SigninFormComponent],
  templateUrl: "./sign-in.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  constructor(private readonly router: Router) {}

  onSubmit(data: SignInFormData): void {
    console.log("Sign in:", data);
    void this.router.navigateByUrl("/app/administracion/usuarios");
  }

  onSignUp(): void {
    this.router.navigateByUrl("/signup");
  }
}

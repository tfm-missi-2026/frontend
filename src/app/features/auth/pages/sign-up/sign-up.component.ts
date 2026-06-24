import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Router } from "@angular/router";

import {
  SignupFormComponent,
  SignUpFormData,
} from "../../components/signup-form/signup-form.component";

@Component({
  selector: "SignUp",
  standalone: true,
  imports: [SignupFormComponent],
  templateUrl: "./sign-up.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  constructor(private readonly router: Router) {}

  onSubmit(data: SignUpFormData): void {
    console.log("Sign up:", data);
  }

  onSignIn(): void {
    this.router.navigateByUrl("/signin");
  }
}

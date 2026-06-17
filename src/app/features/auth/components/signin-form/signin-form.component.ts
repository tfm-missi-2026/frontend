import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from "@angular/core";

import { UiButtonComponent } from "@shared/ui/button";
import { UiInputComponent } from "@shared/ui/input";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiLinkComponent } from "@shared/ui/link";
import { IconEyeOffComponent, IconEyeOpenComponent } from "@shared/icons";

export interface SignInFormData {
  email: string;
  password: string;
}

/**
 * Formulario de inicio de sesión del feature `auth`.
 *
 * Compone únicamente primitivas del design system: `UiHeader`, `UiLabel`,
 * `UiInput`, `UiButton` y `UiLink`.
 *
 * No emite submit por sí mismo: expone `submitForm` y `signUpRequested`
 * para que la página decida el routing y la integración con backend.
 */
@Component({
  selector: "SigninForm",
  standalone: true,
  imports: [
    UiButtonComponent,
    UiInputComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiLinkComponent,
    IconEyeOffComponent,
    IconEyeOpenComponent,
    UiFlexComponent,
  ],
  templateUrl: "./signin-form.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninFormComponent {
  readonly email = signal<string>("");
  readonly password = signal<string>("");
  readonly showPassword = signal<boolean>(false);

  readonly submitForm = output<SignInFormData>();
  readonly forgotPasswordRequested = output<void>();
  readonly signUpRequested = output<void>();

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  onEmailChange(value: string): void {
    this.email.set(value);
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
  }

  onSubmit(): void {
    this.submitForm.emit({
      email: this.email(),
      password: this.password(),
    });
  }

  onForgotPassword(): void {
    this.forgotPasswordRequested.emit();
  }

  onSignUp(): void {
    this.signUpRequested.emit();
  }
}
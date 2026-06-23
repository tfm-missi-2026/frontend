import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from "@angular/core";

import { UiButtonComponent } from "@shared/ui/button";
import { UiInputComponent } from "@shared/ui/input";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiGridComponent } from "@shared/ui/grid";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiLinkComponent } from "@shared/ui/link";
import { IconEyeOffComponent, IconEyeOpenComponent } from "@shared/icons";

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Formulario de registro del feature `auth`.
 *
 * Mismas convenciones que `SigninFormComponent`: solo primitivas del
 * design system, sin `<div>` / `<span>` sueltos.
 */
@Component({
  selector: "SignupForm",
  standalone: true,
  host: { class: "w-full max-w-md mx-auto h-full flex flex-col" },
  imports: [
    UiButtonComponent,
    UiInputComponent,
    UiFlexComponent,
    UiGridComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiLinkComponent,
    IconEyeOffComponent,
    IconEyeOpenComponent,
  ],
  templateUrl: "./signup-form.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupFormComponent {
  readonly firstName = signal<string>("");
  readonly lastName = signal<string>("");
  readonly email = signal<string>("");
  readonly password = signal<string>("");
  readonly showPassword = signal<boolean>(false);

  readonly submitForm = output<SignUpFormData>();
  readonly signInRequested = output<void>();

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  onFirstNameChange(value: string): void {
    this.firstName.set(value);
  }

  onLastNameChange(value: string): void {
    this.lastName.set(value);
  }

  onEmailChange(value: string): void {
    this.email.set(value);
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
  }

  onSubmit(): void {
    this.submitForm.emit({
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      password: this.password(),
    });
  }

  onSignIn(): void {
    this.signInRequested.emit();
  }
}
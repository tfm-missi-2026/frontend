import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";

import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";

export interface SignInFormData {
  email: string;
  password: string;
}

@Component({
  selector: "SigninForm",
  standalone: true,
  host: { class: "w-full max-w-80 mx-auto flex flex-col" },
  imports: [
    UiAlertComponent,
    UiButtonComponent,
    UiInputComponent,
    UiLabelComponent,
    UiFlexComponent,
  ],
  templateUrl: "./signin-form.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninFormComponent {
  readonly email = signal<string>("");
  readonly password = signal<string>("");

  readonly loading = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);

  readonly submitForm = output<SignInFormData>();
  readonly forgotPasswordRequested = output<void>();

  onEmailChange(value: string): void {
    this.email.set(value);
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
  }

  onSubmit(event?: Event): void {
    event?.preventDefault();
    this.submitForm.emit({
      email: this.email(),
      password: this.password(),
    });
  }
}
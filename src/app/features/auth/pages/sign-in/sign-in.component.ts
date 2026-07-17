import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "@core/auth/auth.service";

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
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  protected readonly loading = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);

  onSubmit(data: SignInFormData): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth
      .login({ email: data.email, contrasenia: data.password })
      .subscribe({
        next: () => {
          this.loading.set(false);
          void this.router.navigateByUrl("/app");
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.errorMessage.set(
            error.status === 401
              ? "Correo o contraseña incorrectos."
              : "No se pudo conectar con el servidor. Intenta nuevamente.",
          );
        },
      });
  }

  onSignUp(): void {
    void this.router.navigateByUrl("/signup");
  }
}

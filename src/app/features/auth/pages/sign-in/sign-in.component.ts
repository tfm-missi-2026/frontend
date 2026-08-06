import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";

import { AuthService } from "@core/auth/auth.service";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiToastComponent } from "@shared/ui/toast";

import {
  SigninFormComponent,
  SignInFormData,
} from "../../components/signin-form/signin-form.component";

@Component({
  selector: "SignIn",
  standalone: true,
  imports: [
    SigninFormComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiModalComponent,
    UiToastComponent,
  ],
  templateUrl: "./sign-in.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loading = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly forgotModalOpen = signal<boolean>(false);

  onSubmit(data: SignInFormData): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth
      .login({ email: data.email, contrasenia: data.password })
      .pipe(takeUntilDestroyed(this.destroyRef))
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
}
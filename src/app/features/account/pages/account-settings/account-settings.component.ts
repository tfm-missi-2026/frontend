import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { finalize } from "rxjs";

import { AuthService } from "@core/auth/auth.service";
import { ToastService } from "@core/http/toast.service";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormComponent } from "@shared/ui/form";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import { AccountApiService } from "../../services/account-api.service";

interface AccountField {
  label: string;
  value: string;
}

const PASSWORD_MIN = 8;

@Component({
  selector: "AccountSettingsPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiFormComponent,
    UiHeaderComponent,
    UiInputComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./account-settings.component.html",
})
export class AccountSettingsPageComponent {
  private readonly auth = inject(AuthService);
  private readonly accountApi = inject(AccountApiService);
  private readonly toast = inject(ToastService);

  protected readonly breadcrumbItems = [
    { label: "Mi cuenta" },
    { label: "Configuración" },
  ];

  protected readonly fields = computed<AccountField[]>(() => {
    const usuario = this.auth.usuario();
    return [
      { label: "Nombre", value: usuario?.nombreCompleto ?? "—" },
      { label: "Correo electrónico", value: usuario?.email ?? "—" },
      { label: "Rol", value: usuario?.rol?.nombre ?? "—" },
      { label: "Descripción del rol", value: usuario?.rol?.descripcion ?? "—" },
    ];
  });

  // Cambio de contraseña. La actual solo se valida al enviar (el backend
  // responde 409 si no coincide); las nuevas se validan mientras se digita.
  // Al cambiarla la sesión activa se conserva; la nueva contraseña aplica
  // desde el próximo inicio de sesión.
  protected readonly contraseniaActual = signal<string>("");
  protected readonly contraseniaNueva = signal<string>("");
  protected readonly contraseniaConfirmar = signal<string>("");
  protected readonly saving = signal<boolean>(false);

  protected readonly nuevaError = computed<string | undefined>(() => {
    const value = this.contraseniaNueva();
    if (value.length === 0) return undefined;
    if (value.length < PASSWORD_MIN) {
      return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`;
    }
    if (value === this.contraseniaActual()) {
      return "La nueva contraseña no puede ser igual a la actual.";
    }
    return undefined;
  });

  protected readonly confirmarError = computed<string | undefined>(() => {
    if (this.contraseniaConfirmar().length === 0) return undefined;
    if (this.contraseniaConfirmar() !== this.contraseniaNueva()) {
      return "Las contraseñas no coinciden.";
    }
    return undefined;
  });

  protected readonly canSubmit = computed<boolean>(
    () =>
      !this.saving() &&
      this.contraseniaActual().length > 0 &&
      this.contraseniaNueva().length > 0 &&
      this.nuevaError() === undefined &&
      this.confirmarError() === undefined &&
      this.contraseniaConfirmar().length > 0,
  );

  protected onContraseniaActualChange(value: string): void {
    this.contraseniaActual.set(value);
  }

  protected onContraseniaNuevaChange(value: string): void {
    this.contraseniaNueva.set(value);
  }

  protected onContraseniaConfirmarChange(value: string): void {
    this.contraseniaConfirmar.set(value);
  }

  protected onSubmitPassword(): void {
    if (!this.canSubmit()) return;

    this.saving.set(true);
    this.accountApi
      .cambiarContrasenia({
        contraseniaActual: this.contraseniaActual(),
        contraseniaNueva: this.contraseniaNueva(),
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.resetForm();
          this.toast.success(
            "Contraseña actualizada correctamente. En tu próximo inicio de sesión deberás usar la nueva contraseña.",
            "Contraseña actualizada",
          );
        },
        // Los errores HTTP (409 contraseña actual incorrecta, validaciones,
        // sin conexión) ya los notifica el errorInterceptor con un toast.
      });
  }

  private resetForm(): void {
    this.contraseniaActual.set("");
    this.contraseniaNueva.set("");
    this.contraseniaConfirmar.set("");
  }
}

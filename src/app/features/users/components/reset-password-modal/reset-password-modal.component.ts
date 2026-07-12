import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { isPlatformBrowser } from "@angular/common";

import { IconLinkComponent } from "@shared/icons";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";

import { UsersMockService } from "../../services/users-mock.service";
import type { User } from "../../models/user";
import { userFullName } from "../../models/user";

@Component({
  selector: "ResetPasswordModal",
  standalone: true,
  imports: [
    FormsModule,
    UiAlertComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiInputComponent,
    UiLabelComponent,
    UiModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiModal
      [isOpen]="isOpen()"
      [showCloseButton]="true"
      className="max-w-115 p-6 lg:p-8"
      (close)="onCancel()"
    >
      <UiLabel
        type="HeadingM"
        color="textStrong"
        weight="semibold"
        className="mb-1"
      >
        Restablecer contraseña
      </UiLabel>
      <UiLabel type="bodyS" color="textWeak" className="mb-4">
        Usuario:
        <b class="text-gray-800 dark:text-white/90">{{ fullName() }}</b> ·
        {{ user()?.email }}
      </UiLabel>

      <UiAlert
        variant="warning"
        message="Se generará una contraseña temporal. La contraseña actual del usuario dejará de ser válida."
        className="mb-4"
      />

      <UiLabel
        type="bodyXs"
        color="textStrong"
        weight="medium"
        className="mb-2 block uppercase"
      >
        Contraseña temporal generada
      </UiLabel>
      <UiFlex
        direction="row"
        alignItems="center"
        [gap]="3"
        className="mb-2"
      >
        <UiInput
          className="flex-1"
          [readOnly]="true"
          [ngModel]="generatedPassword()"
        />
        <UiButton
          variant="secondary"
          [compact]="true"
          [LeftIcon]="copyIcon"
          labelText="Copiar"
          (click)="onCopy()"
        />
      </UiFlex>
      <UiLabel type="bodyS" color="textWeak" className="mb-4">
        <b class="text-gray-800 dark:text-white/90"
          >Entregue esta contraseña temporal al usuario.</b
        >
        Deberá cambiarla en su primer acceso.
      </UiLabel>

      @if (copyFeedback() === "success") {
        <UiAlert
          variant="success"
          message="Contraseña temporal copiada al portapapeles."
          className="mb-4"
        />
      } @else if (copyFeedback() === "error") {
        <UiAlert
          variant="error"
          message="No se pudo copiar la contraseña. Selecciónala manualmente."
          className="mb-4"
        />
      }

      <UiAlert
        variant="info"
        message="Este flujo permite que el administrador restablezca la contraseña cuando un usuario no puede acceder."
        className="mb-4"
      />

      <UiFlex
        direction="row"
        justifyContent="end"
        [gap]="2"
        className="mt-4 border-t border-dashed border-gray-200 pt-4 dark:border-gray-800"
      >
        <UiButton variant="secondary" labelText="Cerrar" (click)="onCancel()" />
        <UiButton
          variant="primary"
          labelText="Confirmar restablecimiento"
          (click)="onConfirm()"
        />
      </UiFlex>
    </UiModal>
  `,
})
export class ResetPasswordModalComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly usersService = inject(UsersMockService);

  readonly isOpen = input<boolean>(false);
  readonly user = input<User | null>(null);

  readonly close = output<void>();
  readonly confirm = output<string>();

  protected readonly generatedPassword = signal<string>("");
  protected readonly copyFeedback = signal<"success" | "error" | null>(null);

  protected readonly fullName = computed<string>(() => {
    const u = this.user();
    return u ? userFullName(u) : "";
  });

  protected readonly copyIcon = IconLinkComponent;

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (open) {
        this.copyFeedback.set(null);
        this.generatedPassword.set(this.usersService.generateTempPassword());
      }
    });
  }

  protected async onCopy(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (
      typeof navigator === "undefined" ||
      !navigator.clipboard ||
      typeof navigator.clipboard.writeText !== "function"
    ) {
      this.copyFeedback.set("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(this.generatedPassword());
      this.copyFeedback.set("success");
    } catch {
      this.copyFeedback.set("error");
    }
  }

  protected onConfirm(): void {
    this.confirm.emit(this.generatedPassword());
  }

  protected onCancel(): void {
    this.close.emit();
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID } from "@angular/core";

import { IconLinkComponent } from "@shared/icons";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";

import type { User } from "../../models/user";
import { userFullName } from "../../models/user";
import { generateTempPassword } from "../../services/temp-password.util";
import { UsersService } from "../../services/users.service";

@Component({
  selector: "ResetPasswordModal",
  standalone: true,
  imports: [
    UiAlertComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./reset-password-modal.component.html",
})
export class ResetPasswordModalComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly usersService = inject(UsersService);

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
        this.generatedPassword.set(generateTempPassword());
      }
    });
  }

  protected onCopy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      void navigator.clipboard.writeText(this.generatedPassword());
    }
  }

  protected async onConfirm(): Promise<void> {
    const u = this.user();
    if (!u) return;
    const ok = await this.usersService.resetPassword(u.id, this.generatedPassword());
    if (ok) {
      this.confirm.emit(this.generatedPassword());
    }
  }

  protected onCancel(): void {
    this.close.emit();
  }
}

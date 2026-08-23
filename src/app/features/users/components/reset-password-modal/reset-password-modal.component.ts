import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID, inject } from "@angular/core";

import {
  IconCheckComponent,
  IconLinkComponent,
  IconXComponent,
} from "@shared/icons";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";

import type { User } from "../../models/user";
import { userFullName } from "../../models/user";
import { generateTempPassword } from "../../services/temp-password.util";

export type ResetPasswordPayload = {
  userId: string;
  contraseniaPlano: string;
};

@Component({
  selector: "ResetPasswordModal",
  standalone: true,
  imports: [
    UiAlertComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiModalComponent,
    UiFormLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./reset-password-modal.component.html",
})
export class ResetPasswordModalComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly isOpen = input<boolean>(false);
  readonly user = input<User | null>(null);
  readonly saving = input<boolean>(false);

  readonly close = output<void>();
  readonly confirm = output<ResetPasswordPayload>();

  protected readonly IconCheck = IconCheckComponent;
  protected readonly IconX = IconXComponent;
  protected readonly copyIcon = IconLinkComponent;

  protected readonly generatedPassword = signal<string>("");
  protected readonly copyFeedback = signal<"success" | "error" | null>(null);

  protected readonly fullName = computed<string>(() => {
    const u = this.user();
    return u ? userFullName(u) : "";
  });

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
      void navigator.clipboard
        .writeText(this.generatedPassword())
        .then(() => this.copyFeedback.set("success"))
        .catch(() => this.copyFeedback.set("error"));
    } else {
      this.copyFeedback.set("error");
    }
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onAction(side: "left" | "right"): void {
    if (side === "left") {
      this.onCancel();
    } else {
      this.onConfirm();
    }
  }

  protected onConfirm(): void {
    const u = this.user();
    if (!u) return;
    this.confirm.emit({
      userId: u.id,
      contraseniaPlano: this.generatedPassword(),
    });
  }
}

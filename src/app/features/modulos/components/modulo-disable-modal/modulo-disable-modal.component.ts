import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";

import { UiButtonComponent } from "@shared/ui/button";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiTextAreaComponent } from "@shared/ui/text-area";

import type { ModuloResponse } from "@core/modulos/modulo.models";

export interface ModuloDisablePayload {
  motivoEliminacion: string;
}

@Component({
  selector: "ModuloDisableModal",
  standalone: true,
  imports: [
    UiButtonComponent,
    UiFieldErrorComponent,
    UiFlexComponent,
    UiFormLabelComponent,
    UiLabelComponent,
    UiModalComponent,
    UiTextAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./modulo-disable-modal.component.html",
})
export class ModuloDisableModalComponent {
  readonly modulo = input<ModuloResponse | null>(null);
  readonly isOpen = input<boolean>(false);

  readonly close = output<void>();
  readonly confirm = output<ModuloDisablePayload>();

  protected readonly motivo = signal<string>("");

  protected readonly motivoError = computed<string | undefined>(() => {
    const m = this.motivo().trim();
    if (m.length < 5) return "El motivo debe tener al menos 5 caracteres.";
    if (m.length > 500) return "El motivo no puede superar 500 caracteres.";
    return undefined;
  });

  protected readonly isValid = computed<boolean>(
    () => this.motivoError() === undefined,
  );

  protected patchMotivo(value: string): void {
    this.motivo.set(value);
  }

  protected onCancel(): void {
    this.motivo.set("");
    this.close.emit();
  }

  protected onConfirm(): void {
    if (!this.isValid()) return;
    this.confirm.emit({ motivoEliminacion: this.motivo().trim() });
    this.motivo.set("");
  }
}
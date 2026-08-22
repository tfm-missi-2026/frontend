import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiGridComponent } from "@shared/ui/grid";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSelectComponent } from "@shared/ui/select";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { UiTextAreaComponent } from "@shared/ui/text-area";
import type { SelectOption } from "@shared/ui/select";

import {
  emptyVariationForm,
  type ReportVariationPayload,
  type VariationFormData,
} from "../../models/variation-form";
import {
  VARIATION_TYPE_OPTIONS,
  type VariationTarget,
  type VariationType,
} from "../../models/variation";

export interface TargetOption {
  raw: VariationTarget;
  label: string;
}

const TARGET_EMPTY_VALUE = "__none__";

@Component({
  selector: "ReportVariationModal",
  standalone: true,
  imports: [
    FormsModule,
    UiAlertComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiFormLabelComponent,
    UiGridComponent,
    UiInputComponent,
    UiLabelComponent,
    UiModalComponent,
    UiSelectComponent,
    UiSurfaceComponent,
    UiTextAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./report-variation-modal.component.html",
})
export class ReportVariationModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly targetOptions = input<TargetOption[]>([]);
  readonly reportedBy = input<string>("Lucía Fernández Torres");

  readonly close = output<void>();
  readonly save = output<ReportVariationPayload>();

  protected readonly form = signal<VariationFormData>(emptyVariationForm());
  protected readonly validationMessage = signal<string | null>(null);

  protected readonly VARIATION_TYPE_OPTIONS = VARIATION_TYPE_OPTIONS;

  protected readonly targetSelectOptions = computed<SelectOption[]>(() => {
    const opts: SelectOption[] = this.targetOptions().map((t) => ({
      value: encodeTarget(t.raw),
      label: t.label,
    }));
    opts.unshift({
      value: TARGET_EMPTY_VALUE,
      label: "Sin tarea específica (a nivel subproyecto)",
    });
    return opts;
  });

  protected readonly canSubmit = computed<boolean>(
    () => this.form().justification.trim().length > 0,
  );

  protected readonly selectedTargetValue = computed<string>(() => {
    const t = this.form().target;
    if (!t) return TARGET_EMPTY_VALUE;
    return encodeTarget(t);
  });

  constructor() {
    effect(() => {
      if (!this.isOpen()) return;
      this.form.set(emptyVariationForm());
      this.validationMessage.set(null);
    });
  }

  protected onTargetChange(value: unknown): void {
    const raw = Array.isArray(value) ? value[0] : value;
    const str = raw == null ? "" : String(raw);
    if (str === "" || str === TARGET_EMPTY_VALUE) {
      this.form.update((f) => ({ ...f, target: null }));
      return;
    }
    const target = decodeTarget(str);
    this.form.update((f) => ({ ...f, target }));
  }

  protected onTypeChange(value: unknown): void {
    const raw = Array.isArray(value) ? value[0] : value;
    const str = raw == null ? "" : String(raw);
    if (!str) return;
    this.form.update((f) => ({ ...f, type: str as VariationType }));
  }

  protected onDescriptionChange(value: string): void {
    this.form.update((f) => ({ ...f, description: value }));
    this.clearValidation();
  }

  protected onJustificationChange(value: string): void {
    this.form.update((f) => ({ ...f, justification: value }));
    this.clearValidation();
  }

  protected onPreviousValueChange(value: string): void {
    this.form.update((f) => ({ ...f, previousValue: value }));
  }

  protected onNewValueChange(value: string): void {
    this.form.update((f) => ({ ...f, newValue: value }));
  }

  protected onDetectionDateChange(value: string): void {
    this.form.update((f) => ({ ...f, detectionDate: value }));
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onSave(): void {
    const f = this.form();
    if (!f.justification.trim()) {
      this.validationMessage.set("La justificación es obligatoria.");
      return;
    }
    this.validationMessage.set(null);
    this.save.emit({
      data: f,
      reportedBy: this.reportedBy(),
    });
  }

  private clearValidation(): void {
    if (this.validationMessage()) this.validationMessage.set(null);
  }
}

function encodeTarget(t: VariationTarget): string {
  if (t.kind === "task") return `task|${t.taskId}|${t.label}|${t.ref ?? ""}`;
  return `subproject|${t.subprojectId}|${t.label}|${t.ref ?? ""}`;
}

function decodeTarget(value: string): VariationTarget | null {
  const parts = value.split("|");
  if (parts.length < 4) return null;
  const [kind, id, label, ref] = parts;
  if (kind === "task") {
    return { kind: "task", taskId: id, label, ref: ref || null };
  }
  if (kind === "subproject") {
    return { kind: "subproject", subprojectId: id, label, ref: ref || null };
  }
  return null;
}

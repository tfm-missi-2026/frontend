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
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiDatePickerComponent } from "@shared/ui/date-picker";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiGridComponent } from "@shared/ui/grid";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSelectComponent } from "@shared/ui/select";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { UiTextAreaComponent } from "@shared/ui/text-area";

import {
  emptySubprojectForm,
  type SubprojectFormData,
  type SubprojectFormSavePayload,
} from "../../models/subproject-form";
import {
  SUBPROJECT_PRIORITY_OPTIONS,
  SUBPROJECT_REQUESTER_OPTIONS,
  SUBPROJECT_TYPE_OPTIONS,
  TICKET_REGEX,
  type Subproject,
} from "../../models/subproject";

export type SubprojectFormMode = "create" | "edit";

@Component({
  selector: "SubprojectFormModal",
  standalone: true,
  imports: [
    FormsModule,
    UiAlertComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiDatePickerComponent,
    UiFieldErrorComponent,
    UiFlexComponent,
    UiGridComponent,
    UiInputComponent,
    UiLabelComponent,
    UiModalComponent,
    UiSelectComponent,
    UiSurfaceComponent,
    UiTextAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./subproject-form-modal.component.html",
})
export class SubprojectFormModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly mode = input<SubprojectFormMode>("create");
  readonly projectCode = input<string>("");
  readonly projectId = input<string>("");
  readonly subproject = input<Subproject | null>(null);

  readonly close = output<void>();
  readonly save = output<SubprojectFormSavePayload>();

  protected readonly typeOptions = SUBPROJECT_TYPE_OPTIONS;
  protected readonly priorityOptions = SUBPROJECT_PRIORITY_OPTIONS;
  protected readonly requesterOptions = SUBPROJECT_REQUESTER_OPTIONS;

  protected readonly form = signal<SubprojectFormData>(
    emptySubprojectForm(),
  );

  protected readonly validationMessage = signal<string | null>(null);
  protected readonly typeError = signal<string | null>(null);
  protected readonly ticketError = signal<string | null>(null);
  protected readonly descriptionError = signal<string | null>(null);
  protected readonly priorityError = signal<string | null>(null);
  protected readonly requesterError = signal<string | null>(null);
  protected readonly dateError = signal<string | null>(null);

  protected readonly heading = computed<string>(() => {
    if (this.mode() === "create") return "Nuevo subproyecto";
    const sub = this.subproject();
    const ticket = sub?.ticket ?? "—";
    return `Editar subproyecto · ${ticket}`;
  });

  protected readonly subheading = computed<string>(
    () => `Unidad de trabajo sobre ${this.projectCode() || "el proyecto"}.`,
  );

  protected readonly showRejectionBlock = computed<boolean>(
    () =>
      this.mode() === "edit" &&
      this.subproject()?.situation === "Rechazado",
  );

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (!open) return;
      this.resetErrors();
      const m = this.mode();
      const s = this.subproject();
      if (m === "edit" && s) {
        this.form.set({
          type: s.type,
          ticket: s.ticket,
          description: s.description,
          priority: s.priority,
          requester: s.requester,
          requestDate: s.requestDate,
          rejectionReason: s.rejectionReason,
        });
      } else {
        this.form.set(emptySubprojectForm());
      }
    });
  }

  private resetErrors(): void {
    this.validationMessage.set(null);
    this.typeError.set(null);
    this.ticketError.set(null);
    this.descriptionError.set(null);
    this.priorityError.set(null);
    this.requesterError.set(null);
    this.dateError.set(null);
  }

  protected onTypeChange(value: unknown): void {
    this.patch({ type: (value as SubprojectFormData["type"]) ?? "Incidencia" });
    this.typeError.set(null);
  }

  protected onTicketChange(value: string): void {
    const trimmed = value.trim();
    this.patch({ ticket: trimmed === "" ? null : trimmed });
    this.ticketError.set(null);
  }

  protected onDescriptionChange(value: string): void {
    this.patch({ description: value });
    this.descriptionError.set(null);
  }

  protected onPriorityChange(value: unknown): void {
    this.patch({
      priority: (value as SubprojectFormData["priority"]) ?? "Media",
    });
    this.priorityError.set(null);
  }

  protected onRequesterChange(value: unknown): void {
    this.patch({
      requester: (value as string) ?? "Mesa de Ayuda",
    });
    this.requesterError.set(null);
  }

  protected onDateChange(value: string | string[]): void {
    const iso = Array.isArray(value) ? value[0] ?? "" : value ?? "";
    this.patch({ requestDate: iso });
    this.dateError.set(null);
  }

  protected onRejectionReasonChange(value: string): void {
    this.patch({ rejectionReason: value.trim() === "" ? null : value.trim() });
  }

  protected patch(partial: Partial<SubprojectFormData>): void {
    this.form.update((prev) => ({ ...prev, ...partial }));
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onSave(): void {
    const f = this.form();
    const errors = this.validate(f);
    this.typeError.set(errors.type);
    this.ticketError.set(errors.ticket);
    this.descriptionError.set(errors.description);
    this.priorityError.set(errors.priority);
    this.requesterError.set(errors.requester);
    this.dateError.set(errors.date);

    if (Object.values(errors).some((v) => v !== null)) {
      this.validationMessage.set(
        "Revisa los campos marcados antes de guardar.",
      );
      return;
    }
    this.validationMessage.set(null);

    const data: SubprojectFormData = {
      type: f.type,
      ticket:
        f.ticket && f.ticket.trim() !== ""
          ? f.ticket.trim().toUpperCase()
          : null,
      description: f.description.trim(),
      priority: f.priority,
      requester: f.requester,
      requestDate: f.requestDate,
      rejectionReason:
        f.rejectionReason && f.rejectionReason.trim() !== ""
          ? f.rejectionReason.trim()
          : null,
    };

    const s = this.subproject();
    const projectId = this.projectId();
    if (this.mode() === "create") {
      this.save.emit({ mode: "create", projectId, data });
    } else if (s) {
      this.save.emit({ mode: "edit", projectId, id: s.id, data });
    }
  }

  private validate(
    form: SubprojectFormData,
  ): {
    type: string | null;
    ticket: string | null;
    description: string | null;
    priority: string | null;
    requester: string | null;
    date: string | null;
  } {
    const errors = {
      type: null as string | null,
      ticket: null as string | null,
      description: null as string | null,
      priority: null as string | null,
      requester: null as string | null,
      date: null as string | null,
    };

    if (!form.type) errors.type = "Selecciona un tipo.";
    if (form.ticket && !TICKET_REGEX.test(form.ticket)) {
      errors.ticket = "Solo letras mayúsculas, números y guion.";
    }
    if (!form.description.trim()) {
      errors.description = "La descripción es obligatoria.";
    }
    if (!form.priority) errors.priority = "Selecciona una prioridad.";
    if (!form.requester) errors.requester = "Selecciona un solicitante.";
    if (!form.requestDate) errors.date = "Selecciona una fecha.";

    return errors;
  }
}
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
import { FormsModule } from "@angular/forms";

import { UiAlertComponent } from "@shared/ui/alert";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiDatePickerComponent } from "@shared/ui/date-picker";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiGridComponent } from "@shared/ui/grid";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSelectComponent } from "@shared/ui/select";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { UiTextAreaComponent } from "@shared/ui/text-area";

import { CatalogService } from "@features/catalog/services/catalog.service";
import { ToastService } from "@core/http/toast.service";

import {
  emptyTaskForm,
  type TaskFormData,
  type TaskFormSavePayload,
} from "../../models/task-form";
import type { Task } from "../../models/task";

export type TaskFormMode = "create" | "edit";

const WORKDAY_HOURS = 8;

function formatJornadas(hours: number | null): string {
  if (!hours || hours <= 0) return "0.00";
  return (hours / WORKDAY_HOURS).toFixed(2);
}

@Component({
  selector: "TaskFormModal",
  standalone: true,
  imports: [
    FormsModule,
    UiAlertComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiDatePickerComponent,
    UiFieldErrorComponent,
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
  templateUrl: "./task-form-modal.component.html",
})
export class TaskFormModalComponent {
  private readonly catalogService = inject(CatalogService);
  private readonly toastService = inject(ToastService);

  // Transiciones validas de situacion (mismo esquema que Subproyectos).
  // Nombres tal cual el catalogo backend (sin acentos, "En atencion").
  private static readonly SITUATION_TRANSITIONS: Readonly<
    Record<string, readonly string[]>
  > = {
    Pendiente: ["En atencion", "Rechazado"],
    "En atencion": ["Culminado", "Rechazado"],
    Culminado: [],
    Rechazado: [],
  };

  readonly isOpen = input<boolean>(false);
  readonly mode = input<TaskFormMode>("create");
  readonly subprojectCode = input<string>("");
  readonly subprojectId = input<string>("");
  readonly task = input<Task | null>(null);
  readonly candidates = input<Task[]>([]);

  readonly close = output<void>();
  readonly save = output<TaskFormSavePayload>();

  protected readonly form = signal<TaskFormData>(emptyTaskForm());
  protected readonly validationMessage = signal<string | null>(null);
  protected readonly nameError = signal<string | null>(null);
  protected readonly hoursError = signal<string | null>(null);
  protected readonly dateRangeError = signal<string | null>(null);
  protected readonly situationError = signal<string | null>(null);

  private readonly situationCatalogItems = computed(() =>
    this.catalogService.byGroup("SIT"),
  );

  private situationName(id: string): string | undefined {
    return this.situationCatalogItems().find((i) => i.id === id)?.name;
  }

  protected readonly situationOptions = computed(() => {
    const current = this.task()?.situationId ?? "";
    const currentName = this.situationName(current);
    const allowedNames = new Set<string>(
      currentName
        ? TaskFormModalComponent.SITUATION_TRANSITIONS[currentName] ?? []
        : [],
    );
    return this.situationCatalogItems()
      .filter((i) => i.id === current || allowedNames.has(i.name))
      .map((i) => ({ value: i.id, label: i.name }));
  });

  protected readonly isSituationTerminal = computed<boolean>(() => {
    const currentName = this.situationName(this.task()?.situationId ?? "");
    return (
      !!currentName &&
      (TaskFormModalComponent.SITUATION_TRANSITIONS[currentName]?.length ?? 0) === 0
    );
  });

  protected readonly candidatesList = computed(() => this.candidates());

  protected readonly heading = computed<string>(() => {
    if (this.mode() === "create") return "Nueva tarea";
    const t = this.task();
    return t ? `Editar tarea · ${t.name}` : "Editar tarea";
  });

  protected readonly subheading = computed<string>(
    () =>
      `Pieza ejecutable bajo #${
        this.subprojectCode() || this.subprojectId() || "—"
      }.`,
  );

  protected readonly jornadaLabel = computed<string>(() => {
    const hours = this.form().estimatedHours ?? 0;
    return `Jornada base de cálculo: ${WORKDAY_HOURS} h/día. ${hours} h ≈ ${formatJornadas(
      hours,
    )} jornadas.`;
  });

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (!open) return;
      this.resetErrors();
      const m = this.mode();
      const t = this.task();
      if (m === "edit" && t) {
        this.form.set({
          name: t.name,
          description: t.description,
          startDate: t.startDate,
          endDate: t.endDate,
          estimatedHours: t.estimatedHours || null,
          situationId: t.situationId,
        });
      } else {
        this.form.set(emptyTaskForm());
      }
    });
  }

  private resetErrors(): void {
    this.validationMessage.set(null);
    this.nameError.set(null);
    this.hoursError.set(null);
    this.dateRangeError.set(null);
    this.situationError.set(null);
  }

  protected onSituationChange(value: unknown): void {
    this.patch({ situationId: value == null ? "" : String(value) });
    this.situationError.set(null);
  }

  protected onNameChange(value: string): void {
    this.patch({ name: value });
    this.nameError.set(null);
  }

  protected onDescriptionChange(value: string): void {
    this.patch({ description: value });
  }

  protected onStartDateChange(value: string | string[]): void {
    const iso = Array.isArray(value) ? value[0] ?? "" : value ?? "";
    this.patch({ startDate: iso === "" ? null : iso });
    this.dateRangeError.set(null);
  }

  protected onEndDateChange(value: string | string[]): void {
    const iso = Array.isArray(value) ? value[0] ?? "" : value ?? "";
    this.patch({ endDate: iso === "" ? null : iso });
    this.dateRangeError.set(null);
  }

  protected onHoursChange(value: string | number | undefined): void {
    if (value === undefined || value === null || value === "") {
      this.patch({ estimatedHours: null });
      this.hoursError.set(null);
      return;
    }
    const num = Number(value);
    if (Number.isFinite(num) && num >= 0) {
      this.patch({ estimatedHours: num });
      this.hoursError.set(null);
    } else {
      this.patch({ estimatedHours: null });
      this.hoursError.set("Número inválido.");
    }
  }

  private patch(partial: Partial<TaskFormData>): void {
    this.form.update((prev) => ({ ...prev, ...partial }));
  }

  protected onCancel(): void {
    this.toastService.warning(
      "No se guardaron los cambios de la tarea.",
      "Operación cancelada",
    );
    this.close.emit();
  }

  protected onSave(): void {
    const f = this.form();
    const errors = this.validate(f);
    this.nameError.set(errors.name);
    this.hoursError.set(errors.hours);
    this.dateRangeError.set(errors.dateRange);
    this.situationError.set(errors.situation);

    if (errors.name || errors.hours || errors.dateRange || errors.situation) {
      this.validationMessage.set(
        "Revisa los campos marcados antes de guardar.",
      );
      return;
    }
    this.validationMessage.set(null);

    const data: TaskFormData = {
      name: f.name.trim(),
      description: f.description.trim(),
      startDate: f.startDate,
      endDate: f.endDate,
      estimatedHours: f.estimatedHours ?? 0,
      situationId: f.situationId,
    };

    const t = this.task();
    const subprojectId = this.subprojectId();
    if (this.mode() === "create") {
      this.save.emit({ mode: "create", subprojectId, data });
    } else if (t) {
      this.save.emit({ mode: "edit", subprojectId, id: t.id, data });
    }
  }

  private validate(form: TaskFormData): {
    name: string | null;
    hours: string | null;
    dateRange: string | null;
    situation: string | null;
  } {
    const errors = {
      name: null,
      hours: null,
      dateRange: null,
      situation: null,
    } as {
      name: string | null;
      hours: string | null;
      dateRange: string | null;
      situation: string | null;
    };
    if (!form.name.trim()) errors.name = "El nombre es obligatorio.";
    if (form.estimatedHours === null || form.estimatedHours <= 0) {
      errors.hours = "Ingresa las horas estimadas (mayor a 0).";
    } else if (form.estimatedHours > 999) {
      errors.hours = "Las horas deben estar entre 0 y 999.";
    }
    if (!form.startDate || !form.endDate) {
      errors.dateRange = "Selecciona fecha de inicio y fin.";
    } else if (form.endDate < form.startDate) {
      errors.dateRange =
        "La fecha de fin debe ser posterior o igual a la de inicio.";
    }
    if (this.mode() === "edit" && !form.situationId) {
      errors.situation = "Selecciona una situación.";
    }
    return errors;
  }
}
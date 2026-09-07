import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { UsersService } from "@features/users/services/users.service";
import { userFullName } from "@features/users/models/user";
import { ToastService } from "@core/http/toast.service";
import { CatalogService } from "@features/catalog/services/catalog.service";

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
  SUBPROJECT_TYPE_OPTIONS,
  TICKET_REGEX,
  type Subproject,
} from "../../models/subproject";

export type SubprojectFormMode = "create" | "edit";

const DESCRIPTION_MIN_LENGTH = 10;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

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
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);
  private readonly catalogService = inject(CatalogService);

  // Transiciones validas de situacion. Los nombres coinciden tal cual con
  // el texto almacenado en el catalogo backend (grupo SITUACION), sin
  // acentos ("En atencion"), ya que se comparan por igualdad de string.
  // Culminado y Rechazado son estados terminales: no se ofrecen mas
  // transiciones desde ahi.
  private static readonly SITUATION_TRANSITIONS: Readonly<
    Record<string, readonly string[]>
  > = {
    Pendiente: ["En atencion", "Rechazado"],
    "En atencion": ["Culminado", "Rechazado"],
    Culminado: [],
    Rechazado: [],
  };

  readonly isOpen = input<boolean>(false);
  readonly mode = input<SubprojectFormMode>("create");
  readonly projectCode = input<string>("");
  readonly projectId = input<string>("");
  readonly subproject = input<Subproject | null>(null);
  /** Tickets activos de otros subproyectos del mismo proyecto, para detectar duplicados. */
  readonly existingTickets = input<readonly string[]>([]);

  readonly close = output<void>();
  readonly save = output<SubprojectFormSavePayload>();

  protected readonly typeOptions = SUBPROJECT_TYPE_OPTIONS;
  protected readonly priorityOptions = SUBPROJECT_PRIORITY_OPTIONS;

  protected readonly requesterOptions = computed(() =>
    this.usersService
      .users()
      .filter((u) => u.status === "active")
      .map((u) => ({ value: u.id, label: userFullName(u) })),
  );

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
  protected readonly situationError = signal<string | null>(null);

  private readonly situationCatalogItems = computed(() =>
    this.catalogService.byGroup("SIT"),
  );

  private situationName(id: string): string | undefined {
    return this.situationCatalogItems().find((i) => i.id === id)?.name;
  }

  /** Opciones ofrecidas: la situacion actual + las transiciones validas desde ahi. */
  protected readonly situationOptions = computed(() => {
    const current = this.subproject()?.situationId ?? "";
    const currentName = this.situationName(current);
    const allowedNames = new Set<string>(
      currentName
        ? SubprojectFormModalComponent.SITUATION_TRANSITIONS[currentName] ?? []
        : [],
    );
    return this.situationCatalogItems()
      .filter((i) => i.id === current || allowedNames.has(i.name))
      .map((i) => ({ value: i.id, label: i.name }));
  });

  protected readonly isSituationTerminal = computed<boolean>(() => {
    const currentName = this.situationName(this.subproject()?.situationId ?? "");
    return (
      !!currentName &&
      (SubprojectFormModalComponent.SITUATION_TRANSITIONS[currentName]?.length ?? 0) === 0
    );
  });

  protected readonly heading = computed<string>(() => {
    if (this.mode() === "create") return "Nuevo subproyecto";
    const sub = this.subproject();
    const ticket = sub?.ticket ?? "—";
    return `Editar subproyecto · ${ticket}`;
  });

  protected readonly subheading = computed<string>(
    () => `Unidad de trabajo sobre ${this.projectCode() || "el proyecto"}.`,
  );

  // Dinamico: se activa apenas el usuario elige "Rechazado" en el select,
  // no solo cuando el subproyecto ya estaba rechazado de antes.
  protected readonly showRejectionBlock = computed<boolean>(() => {
    if (this.mode() !== "edit") return false;
    const selectedName = this.situationName(this.form().situationId);
    return selectedName === "Rechazado";
  });

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (!open) return;
      untracked(() => void this.usersService.cargar());
      this.resetErrors();
      const m = this.mode();
      const s = this.subproject();
      if (m === "edit" && s) {
        this.form.set({
          type: s.type,
          ticket: s.ticket,
          description: s.description,
          priority: s.priority,
          requesterId: s.requesterId,
          requestDate: s.requestDate,
          situationId: s.situationId,
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
      requesterId: value == null ? "" : String(value),
    });
    this.requesterError.set(null);
  }

  protected onDateChange(value: string | string[]): void {
    const iso = Array.isArray(value) ? value[0] ?? "" : value ?? "";
    this.patch({ requestDate: iso });
    this.dateError.set(null);
  }

  protected onSituationChange(value: unknown): void {
    this.patch({ situationId: value == null ? "" : String(value) });
    this.situationError.set(null);
  }

  protected onRejectionReasonChange(value: string): void {
    this.patch({ rejectionReason: value.trim() === "" ? null : value.trim() });
  }

  protected patch(partial: Partial<SubprojectFormData>): void {
    this.form.update((prev) => ({ ...prev, ...partial }));
  }

  protected onCancel(): void {
    this.toastService.warning(
      "No se guardaron los cambios del subproyecto.",
      "Operación cancelada",
    );
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
    this.situationError.set(errors.situation);

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
      requesterId: f.requesterId,
      requestDate: f.requestDate,
      situationId: f.situationId,
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
    situation: string | null;
  } {
    const errors = {
      type: null as string | null,
      ticket: null as string | null,
      description: null as string | null,
      priority: null as string | null,
      requester: null as string | null,
      date: null as string | null,
      situation: null as string | null,
    };

    if (!form.type) errors.type = "Selecciona un tipo.";
    if (form.ticket && !TICKET_REGEX.test(form.ticket)) {
      errors.ticket = "Solo letras mayúsculas, números y guion.";
    }
    if (form.ticket && !errors.ticket) {
      const dup = this.existingTickets().some(
        (t) => t.toUpperCase() === form.ticket?.toUpperCase(),
      );
      if (dup) {
        errors.ticket = "Ya existe un subproyecto activo con este ticket.";
      }
    }
    if (!form.description.trim()) {
      errors.description = "La descripción es obligatoria.";
    } else if (form.description.trim().length < DESCRIPTION_MIN_LENGTH) {
      errors.description = `Describe con más detalle (mínimo ${DESCRIPTION_MIN_LENGTH} caracteres).`;
    }
    if (!form.priority) errors.priority = "Selecciona una prioridad.";
    if (!form.requesterId) errors.requester = "Selecciona un solicitante.";
    if (!form.requestDate) {
      errors.date = "Selecciona una fecha.";
    } else if (form.requestDate > todayIso()) {
      errors.date = "La fecha de solicitud no puede ser futura.";
    }
    if (this.mode() === "edit") {
      if (!form.situationId) {
        errors.situation = "Selecciona una situación.";
      } else if (
        this.situationName(form.situationId) === "Rechazado" &&
        !form.rejectionReason?.trim()
      ) {
        errors.situation =
          "Indica la justificación del rechazo para continuar.";
      }
    }

    return errors;
  }
}
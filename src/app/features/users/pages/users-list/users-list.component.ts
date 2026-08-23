import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import {
  IconEditPencilComponent,
  IconEnvelopeStrokeComponent,
  IconPlusSimpleComponent,
  IconTrashComponent,
} from "@shared/icons";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";
import {
  UiTableComponent,
  TableColumn,
  type TableCellContext,
} from "@shared/ui/table";

import { ResetPasswordModalComponent } from "../../components/reset-password-modal/reset-password-modal.component";
import type { ResetPasswordPayload } from "../../components/reset-password-modal/reset-password-modal.component";
import { UserFormModalComponent } from "../../components/user-form-modal/user-form-modal.component";
import type { UserFormSavePayload } from "../../models/user-form";
import type { User, UserRole, UserStatus } from "../../models/user";
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS, userFullName } from "../../models/user";
import type { UsuarioQueryParams } from "@core/query-params";
import { UsersAdminService } from "../../services/users-admin.service";

type FormModalState =
  | { mode: "create" }
  | { mode: "edit"; user: User };

/**
 * Pagina de administracion de usuarios.
 *
 * Estado de modales consolidado en un unico signal `modalState`
 * para evitar el "shotgun state" (varios signals relacionados que
 * pueden quedar desincronizados entre si).
 *
 * - `modalState`: null cuando no hay modal abierto.
 * - `formSaving` / `resetSaving`: feedback de mutaciones en curso
 *   (boton con spinner + disabled) controlados aqui, no en el modal.
 *
 * Cada mutacion del servicio (`crear`, `actualizar`, `desactivar`,
 * `resetPassword`) llama internamente `bumpRefresh()` para que el
 * UiTable re-fetchee solo sin necesidad de un trigger explicito desde
 * la pagina.
 */
@Component({
  selector: "UsersListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    FormsModule,
    ResetPasswordModalComponent,
    UiAlertComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSelectComponent,
    UiTableComponent,
    UserFormModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./users-list.component.html",
})
export class UsersListComponent implements OnInit {
  protected readonly admin = inject(UsersAdminService);

  protected readonly plusIcon = IconPlusSimpleComponent;
  protected readonly editIcon = IconEditPencilComponent;
  protected readonly trashIcon = IconTrashComponent;
  protected readonly envelopeIcon = IconEnvelopeStrokeComponent;

  protected readonly breadcrumbItems = [
    { label: "Administración", route: "/app/administracion" },
    { label: "Usuarios" },
  ];

  protected readonly rolOptions: SelectOption[] = USER_ROLE_OPTIONS;
  protected readonly statusOptions: SelectOption[] = USER_STATUS_OPTIONS;
  protected readonly pageSizeOptions: number[] = [5, 10, 20, 50];

  protected readonly errorMessage = this.admin.error;
  protected readonly successAlert = signal<string | null>(null);

  protected readonly fetchUsers = (
    q: Parameters<UsersAdminService["fetchData"]>[0],
  ) => this.admin.fetchData(q);

  protected readonly tableColumns = computed<TableColumn<User>[]>(() => [
    {
      key: "fullName",
      header: "Nombre completo",
      width: "240px",
      sortable: true,
      sortKey: "apellidoPaterno",
      cell: this.nombreCell,
    },
    {
      key: "email",
      header: "Correo electrónico",
      sortable: true,
      sortKey: "email",
    },
    {
      key: "role",
      header: "Rol",
      width: "180px",
      align: "center",
      sortable: true,
      sortKey: "rol",
      cell: this.rolCell,
    },
    {
      key: "status",
      header: "Estado",
      width: "140px",
      align: "center",
      sortable: true,
      sortKey: "estado",
      cell: this.estadoCell,
    },
    {
      key: "acciones",
      header: "Acciones",
      align: "end",
      searchable: false,
      cell: this.accionesCell,
    },
  ]);

  protected readonly modalState = signal<FormModalState | null>(null);
  protected readonly resetTarget = signal<User | null>(null);
  protected readonly formSaving = signal<boolean>(false);
  protected readonly resetSaving = signal<boolean>(false);

  protected readonly filterRol = signal<UserRole | null>(null);
  protected readonly filterStatus = signal<UserStatus | null>(null);

  @ViewChild("nombreCell", { static: true })
  private nombreCell!: TemplateRef<TableCellContext<User>>;
  @ViewChild("rolCell", { static: true })
  private rolCell!: TemplateRef<TableCellContext<User>>;
  @ViewChild("estadoCell", { static: true })
  private estadoCell!: TemplateRef<TableCellContext<User>>;
  @ViewChild("accionesCell", { static: true })
  private accionesCell!: TemplateRef<TableCellContext<User>>;

  ngOnInit(): void {
    // El UiTable dispara el primer fetch automaticamente gracias al
    // `query()` reactivo del service y al effect() interno.
  }

  // ----- Sincronización query signal <-> UiTable -----

  protected onQueryChange(q: UsuarioQueryParams): void {
    this.admin.query.set(q);
  }

  // ----- Filtros de dominio -----

  protected onRolChange(value: string | null): void {
    const rol = (value as UserRole | null) ?? null;
    this.filterRol.set(rol);
    this.admin.filterByRol({ rol });
  }

  protected onStatusChange(value: string | null): void {
    const estado = (value as UserStatus | null) ?? null;
    this.filterStatus.set(estado);
    this.admin.filterByEstado({ estado });
  }

  // ----- Apertura / cierre de modales -----

  protected openCreate(): void {
    this.modalState.set({ mode: "create" });
  }

  protected openEdit(u: User): void {
    this.modalState.set({ mode: "edit", user: u });
  }

  protected closeFormModal(): void {
    this.modalState.set(null);
  }

  protected openResetPassword(u: User): void {
    this.resetTarget.set(u);
  }

  protected closeResetModal(): void {
    this.resetTarget.set(null);
  }

  // ----- Mutaciones delegadas al servicio -----

  protected async onSaveUser(payload: UserFormSavePayload): Promise<void> {
    if (this.formSaving()) return;
    this.formSaving.set(true);
    try {
      if (payload.mode === "create") {
        const created = await this.admin.crear({
          data: {
            firstName: payload.data.firstName,
            lastNamePaternal: payload.data.lastNamePaternal,
            lastNameMaternal: payload.data.lastNameMaternal,
            email: payload.data.email,
            role: payload.data.role,
            status: payload.data.status,
          },
          initialPassword: payload.data.initialPassword,
        });
        if (created) {
          this.successAlert.set(
            `Usuario "${userFullName(created)}" creado.`,
          );
          this.closeFormModal();
        }
      } else {
        const updated = await this.admin.actualizar(payload.id, {
          data: {
            firstName: payload.data.firstName,
            lastNamePaternal: payload.data.lastNamePaternal,
            lastNameMaternal: payload.data.lastNameMaternal,
            email: payload.data.email,
            role: payload.data.role,
            status: payload.data.status,
          },
        });
        if (updated) {
          this.successAlert.set(
            `Usuario "${userFullName(updated)}" actualizado.`,
          );
          this.closeFormModal();
        }
      }
    } finally {
      this.formSaving.set(false);
    }
  }

  protected async onDeactivate(u: User): Promise<void> {
    await this.admin.desactivar(u.id);
    const err = this.admin.error();
    if (!err) {
      this.successAlert.set(
        `Usuario "${userFullName(u)}" dado de baja.`,
      );
    }
  }

  protected async onConfirmReset(payload: ResetPasswordPayload): Promise<void> {
    if (this.resetSaving()) return;
    this.resetSaving.set(true);
    try {
      const ok = await this.admin.resetPassword(
        payload.userId,
        payload.contraseniaPlano,
      );
      if (ok) {
        const target = this.resetTarget();
        this.successAlert.set(
          target
            ? `Contraseña de "${userFullName(target)}" restablecida.`
            : "Contraseña restablecida.",
        );
        this.closeResetModal();
      }
    } finally {
      this.resetSaving.set(false);
    }
  }

  protected onDismissAlert(): void {
    this.successAlert.set(null);
  }

  protected fullName(u: User): string {
    return userFullName(u);
  }

  protected roleLabel(role: UserRole): string {
    const option = USER_ROLE_OPTIONS.find((o) => o.value === role);
    return option?.label ?? role;
  }

  // ----- Selectores derivados para el template -----

  protected readonly formModalMode = computed<"create" | "edit">(() =>
    this.modalState()?.mode ?? "create",
  );

  protected readonly editingUser = computed<User | null>(
    () =>
      this.modalState()?.mode === "edit"
        ? (this.modalState() as { mode: "edit"; user: User }).user
        : null,
  );
}

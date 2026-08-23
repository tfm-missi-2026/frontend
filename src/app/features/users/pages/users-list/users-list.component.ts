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
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";
import {
  UiTableComponent,
  TableColumn,
  type TableCellContext,
} from "@shared/ui/table";

import { ResetPasswordModalComponent } from "../../components/reset-password-modal/reset-password-modal.component";
import { UserFormModalComponent } from "../../components/user-form-modal/user-form-modal.component";
import type { UserFormSavePayload } from "../../models/user-form";
import type { User, UserRole, UserStatus } from "../../models/user";
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS, userFullName } from "../../models/user";
import type { UsuarioQueryParams } from "@core/query-params";
import { UsersAdminService } from "../../services/users-admin.service";

/**
 * Pagina de administracion de usuarios.
 *
 * El UiTable se auto-gestiona: pasa `[(query)]` (signal compartido con
 * el servicio) + `[fetchData]` (funcion declarada en este componente
 * que delega al servicio). NO hay handlers de sort/page/pageSize/search
 * en este componente.
 *
 * Los handlers del componente son solo para:
 *  - Filtros de dominio: rol, estado (via service.filterByRol/Estado).
 *  - Acciones de fila (UI del UiTable): onSaveUser, onDeactivate, etc.,
 *    que delegan al servicio. Las mutaciones disparan `bumpRefresh`
 *    internamente, lo que hace que el UiTable re-fetchee solo.
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

  /** Error fatal (mostrado fuera del UiTable). */
  protected readonly errorMessage = this.admin.error;
  protected readonly successAlert = signal<string | null>(null);

  /**
   * Funcion de carga para el UiTable. Closure que delega al servicio.
   * El UiTable la invoca con el query signal cada vez que cambia.
   */
  protected readonly fetchUsers = (q: Parameters<UsersAdminService["fetchData"]>[0]) =>
    this.admin.fetchData(q);

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

  protected readonly formOpen = signal<boolean>(false);
  protected readonly formMode = signal<"create" | "edit">("create");
  protected readonly selectedUser = signal<User | null>(null);

  protected readonly resetOpen = signal<boolean>(false);
  protected readonly resetUser = signal<User | null>(null);

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

  /**
   * Unico handler del UiTable: recibe el query mutado por sort/page/search
   * y lo aplica al signal compartido del servicio. Esto dispara la
   * reactividad -> el `effect()` interno del UiTable re-ejecuta `fetchData`.
   */
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

  // ----- Acciones (mutaciones via servicio) -----

  protected openCreate(): void {
    this.formMode.set("create");
    this.selectedUser.set(null);
    this.formOpen.set(true);
  }

  protected openEdit(u: User): void {
    this.formMode.set("edit");
    this.selectedUser.set(u);
    this.formOpen.set(true);
  }

  protected openResetPassword(u: User): void {
    this.resetUser.set(u);
    this.resetOpen.set(true);
  }

  protected onSaveUser(payload: UserFormSavePayload): void {
    if (payload.mode === "create") {
      void this.admin.crear({
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
    } else {
      void this.admin.actualizar(payload.id, {
        data: {
          firstName: payload.data.firstName,
          lastNamePaternal: payload.data.lastNamePaternal,
          lastNameMaternal: payload.data.lastNameMaternal,
          email: payload.data.email,
          role: payload.data.role,
          status: payload.data.status,
        },
      });
    }
    this.formOpen.set(false);
  }

  protected onDeactivate(u: User): void {
    void this.admin.desactivar(u.id);
  }

  protected onConfirmReset(_password: string): void {
    this.resetOpen.set(false);
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
}

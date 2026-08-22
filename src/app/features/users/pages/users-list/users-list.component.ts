import {
  ChangeDetectionStrategy,
  Component,
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
  TableAction,
  TableColumn,
  type TableCellContext,
} from "@shared/ui/table";
import { matchesSearch } from "@utils/strings";

import { ResetPasswordModalComponent } from "../../components/reset-password-modal/reset-password-modal.component";
import { UserFormModalComponent } from "../../components/user-form-modal/user-form-modal.component";
import type { UserFormSavePayload } from "../../models/user-form";
import type { User, UserRole, UserStatus } from "../../models/user";
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS, userFullName } from "../../models/user";
import { UsersService } from "../../services/users.service";

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
export class UsersListComponent {
  private readonly usersService = inject(UsersService);

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

  protected readonly users = this.usersService.users;
  protected readonly loading = this.usersService.loading;
  protected readonly errorMessage = this.usersService.error;
  protected readonly successAlert = signal<string | null>(null);

  protected readonly searchTerm = signal<string>("");
  protected readonly filterRol = signal<UserRole | null>(null);
  protected readonly filterStatus = signal<UserStatus | null>(null);

  protected readonly filteredUsers = computed<User[]>(() => {
    const term = this.searchTerm();
    const rol = this.filterRol();
    const status = this.filterStatus();
    return this.users().filter((u) => {
      if (rol && u.role !== rol) return false;
      if (status && u.status !== status) return false;
      const name = userFullName(u);
      return matchesSearch(term, name, u.email);
    });
  });

  protected readonly tableColumns = computed<TableColumn<User>[]>(() => [
    {
      key: "fullName",
      header: "Nombre completo",
      width: "240px",
      searchable: false,
      cell: this.nombreCell,
    },
    {
      key: "email",
      header: "Correo electrónico",
      searchable: true,
    },
    {
      key: "role",
      header: "Rol",
      width: "180px",
      align: "center",
      searchable: false,
      cell: this.rolCell,
    },
    {
      key: "status",
      header: "Estado",
      width: "140px",
      align: "center",
      searchable: false,
      cell: this.estadoCell,
    },
    {
      key: "acciones",
      header: "Acciones",
      width: "200px",
      align: "end",
      searchable: false,
      cell: this.emptyCell,
    },
  ]);

  protected readonly tableActions = computed<TableAction<User>[]>(() => [
    {
      key: "edit",
      label: "Editar",
      icon: IconEditPencilComponent,
      onClick: (user) => this.openEdit(user),
    },
    {
      key: "reset-password",
      label: "Restablecer contraseña",
      icon: IconEnvelopeStrokeComponent,
      onClick: (user) => this.openResetPassword(user),
    },
    {
      key: "deactivate",
      label: "Dar de baja",
      icon: IconTrashComponent,
      onClick: (user) => this.onDeactivate(user),
    },
  ]);

  protected readonly formOpen = signal<boolean>(false);
  protected readonly formMode = signal<"create" | "edit">("create");
  protected readonly selectedUser = signal<User | null>(null);

  protected readonly resetOpen = signal<boolean>(false);
  protected readonly resetUser = signal<User | null>(null);

  @ViewChild("nombreCell", { static: true })
  private nombreCell!: TemplateRef<TableCellContext<User>>;
  @ViewChild("rolCell", { static: true })
  private rolCell!: TemplateRef<TableCellContext<User>>;
  @ViewChild("estadoCell", { static: true })
  private estadoCell!: TemplateRef<TableCellContext<User>>;
  @ViewChild("emptyCell", { static: true })
  private emptyCell!: TemplateRef<TableCellContext<User>>;

  constructor() {
    void this.usersService.cargar();
  }

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
      void this.usersService.crear({
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
      void this.usersService.actualizar(payload.id, {
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
    void this.usersService.desactivar(u.id);
  }

  protected onConfirmReset(_password: string): void {
    this.resetOpen.set(false);
  }

  protected onRolChange(value: string | null): void {
    this.filterRol.set((value as UserRole | null) ?? null);
  }

  protected onStatusChange(value: string | null): void {
    this.filterStatus.set((value as UserStatus | null) ?? null);
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

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";

import { IconPlusSimpleComponent } from "@shared/icons";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";

import { ResetPasswordModalComponent } from "../../components/reset-password-modal/reset-password-modal.component";
import { UserFormModalComponent } from "../../components/user-form-modal/user-form-modal.component";
import { UsersTableComponent } from "../../components/users-table/users-table.component";
import { UsersToolbarComponent } from "../../components/users-toolbar/users-toolbar.component";
import type { UserFormSavePayload } from "../../models/user-form";
import type { User, UserRole, UserStatus } from "../../models/user";
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from "../../models/user";
import { UsersService } from "../../services/users.service";
import { matchesSearch } from "@utils/strings";

@Component({
  selector: "UsersListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    ResetPasswordModalComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UserFormModalComponent,
    UsersTableComponent,
    UsersToolbarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./users-list.component.html",
})
export class UsersListComponent {
  private readonly usersService = inject(UsersService);

  protected readonly plusIcon = IconPlusSimpleComponent;

  protected readonly breadcrumbItems = [
    { label: "Administración", route: "/app/administracion" },
    { label: "Usuarios" },
  ];

  protected readonly rolOptions = USER_ROLE_OPTIONS;
  protected readonly statusOptions = USER_STATUS_OPTIONS;

  protected readonly users = this.usersService.users;
  protected readonly loading = this.usersService.loading;
  protected readonly errorMessage = this.usersService.error;

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
      const fullName =
        `${u.firstName} ${u.lastNamePaternal} ${u.lastNameMaternal}`;
      return matchesSearch(term, fullName, u.email);
    });
  });

  protected readonly formOpen = signal<boolean>(false);
  protected readonly formMode = signal<"create" | "edit">("create");
  protected readonly selectedUser = signal<User | null>(null);

  protected readonly resetOpen = signal<boolean>(false);
  protected readonly resetUser = signal<User | null>(null);

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

  protected onClearFilters(): void {
    this.searchTerm.set("");
    this.filterRol.set(null);
    this.filterStatus.set(null);
  }
}

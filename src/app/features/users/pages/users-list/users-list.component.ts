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
import { UsersMockService } from "../../services/users-mock.service";

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
  template: `
    <UiFlex direction="column" gap="20px">
      <CommonBreadcrumb [items]="breadcrumbItems" />

      <UiFlex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap="12px"
        className="flex-wrap"
      >
        <UiHeader [level]="1" text="Gestión de usuarios" />
        <UiButton
          variant="primary"
          [LeftIcon]="plusIcon"
          labelText="Nuevo usuario"
          (click)="openCreate()"
        />
      </UiFlex>

      <UsersToolbar
        [searchTerm]="searchTerm()"
        [rolValue]="filterRol()"
        [statusValue]="filterStatus()"
        [rolOptions]="rolOptions"
        [statusOptions]="statusOptions"
        (searchChange)="searchTerm.set($event)"
        (rolChange)="onRolChange($event)"
        (statusChange)="onStatusChange($event)"
      />

      <UsersTable
        [users]="filteredUsers()"
        (edit)="openEdit($event)"
        (resetPassword)="openResetPassword($event)"
        (deactivate)="onDeactivate($event)"
        (clearFilters)="onClearFilters()"
      />
    </UiFlex>

    <UserFormModal
      [isOpen]="formOpen()"
      [mode]="formMode()"
      [user]="selectedUser()"
      (save)="onSaveUser($event)"
      (close)="formOpen.set(false)"
    />

    <ResetPasswordModal
      [isOpen]="resetOpen()"
      [user]="resetUser()"
      (confirm)="onConfirmReset($event)"
      (close)="resetOpen.set(false)"
    />
  `,
})
export class UsersListComponent {
  private readonly usersService = inject(UsersMockService);

  protected readonly plusIcon = IconPlusSimpleComponent;

  protected readonly breadcrumbItems = [
    { label: "Administración", route: "/app/administracion" },
    { label: "Usuarios" },
  ];

  protected readonly rolOptions = USER_ROLE_OPTIONS;
  protected readonly statusOptions = USER_STATUS_OPTIONS;

  protected readonly users = this.usersService.users;

  protected readonly searchTerm = signal<string>("");
  protected readonly filterRol = signal<UserRole | null>(null);
  protected readonly filterStatus = signal<UserStatus | null>(null);

  protected readonly filteredUsers = computed<User[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const rol = this.filterRol();
    const status = this.filterStatus();
    return this.users().filter((u) => {
      if (rol && u.role !== rol) return false;
      if (status && u.status !== status) return false;
      if (!term) return true;
      const fullName =
        `${u.firstName} ${u.lastNamePaternal} ${u.lastNameMaternal}`.toLowerCase();
      return fullName.includes(term) || u.email.toLowerCase().includes(term);
    });
  });

  protected readonly formOpen = signal<boolean>(false);
  protected readonly formMode = signal<"create" | "edit">("create");
  protected readonly selectedUser = signal<User | null>(null);

  protected readonly resetOpen = signal<boolean>(false);
  protected readonly resetUser = signal<User | null>(null);

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
      this.usersService.create({
        firstName: payload.data.firstName,
        lastNamePaternal: payload.data.lastNamePaternal,
        lastNameMaternal: payload.data.lastNameMaternal,
        email: payload.data.email,
        role: payload.data.role,
        status: payload.data.status,
      });
    } else {
      this.usersService.update(payload.id, payload.data);
    }
    this.formOpen.set(false);
  }

  protected onDeactivate(u: User): void {
    this.usersService.deactivate(u.id);
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

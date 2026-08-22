import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import {
  IconCheckLargeComponent,
  IconChevronRightComponent,
  IconEditPencilComponent,
  IconPlusSimpleComponent,
  IconTrashComponent,
} from "@shared/icons";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiCardComponent } from "@shared/ui/card";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";

import { PermissionsMatrixComponent } from "../../components/permissions-matrix/permissions-matrix.component";
import { RoleConfirmDeleteModalComponent } from "../../components/role-confirm-delete-modal/role-confirm-delete-modal.component";
import { RoleEditModalComponent } from "../../components/role-edit-modal/role-edit-modal.component";
import { RoleFormModalComponent } from "../../components/role-form-modal/role-form-modal.component";
import { RoleListPanelComponent } from "../../components/role-list-panel/role-list-panel.component";
import type { Role, RoleFormData } from "../../models/role";
import { RolesService } from "../../services/roles.service";

@Component({
  selector: "RolesListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    PermissionsMatrixComponent,
    RoleConfirmDeleteModalComponent,
    RoleEditModalComponent,
    RoleFormModalComponent,
    RoleListPanelComponent,
    UiAlertComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./roles-list.component.html",
})
export class RolesListComponent implements OnInit {
  private readonly rolesService = inject(RolesService);

  ngOnInit(): void {
    void this.bootstrap();
  }

  private async bootstrap(): Promise<void> {
    await this.rolesService.load();
    const roles = this.roles();
    if (this.selectedId() === null && roles.length > 0) {
      this.selectedId.set(roles[0].id);
      void this.rolesService.loadPermissionsForRole(roles[0].id);
    }
  }

  protected readonly plusIcon = IconPlusSimpleComponent;
  protected readonly checkIcon = IconCheckLargeComponent;
  protected readonly pencilIcon = IconEditPencilComponent;
  protected readonly trashIcon = IconTrashComponent;
  protected readonly chevronIcon = IconChevronRightComponent;

  protected readonly breadcrumbItems = [
    { label: "Administración" },
    { label: "Roles" },
  ];

  protected readonly roles = this.rolesService.roles;
  protected readonly modulosRaiz = this.rolesService.modulosRaiz;
  protected readonly loading = this.rolesService.loading;
  protected readonly error = this.rolesService.error;

  protected readonly selectedId = signal<string | null>(null);
  protected readonly draftPermissions = signal<string[] | null>(null);
  protected readonly deleteTargetId = signal<string | null>(null);
  protected readonly editTargetId = signal<string | null>(null);

  protected readonly selectedRole = computed<Role | null>(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.roles().find((r) => r.id === id) ?? null;
  });

  protected readonly effectivePermissions = computed<string[]>(() => {
    const draft = this.draftPermissions();
    if (draft) return draft;
    const id = this.selectedId();
    if (!id) return [];
    return this.rolesService.getPermissionsForRole(id);
  });

  protected readonly totalModules = computed<number>(
    () => this.modulosRaiz().length,
  );

  protected readonly canEditSelected = computed<boolean>(() => {
    const r = this.selectedRole();
    return !!r && !r.sistema;
  });

  protected readonly hasChanges = computed<boolean>(
    () => this.draftPermissions() !== null,
  );

  protected readonly createOpen = signal<boolean>(false);
  protected readonly successAlert = signal<string | null>(null);

  protected onSelectRole(id: string): void {
    this.selectedId.set(id);
    this.draftPermissions.set(null);
    void this.rolesService.loadPermissionsForRole(id);
  }

  protected onPermissionsChange(next: string[]): void {
    if (!this.canEditSelected()) return;
    this.draftPermissions.set(next);
  }

  protected async onSavePermissions(): Promise<void> {
    const id = this.selectedId();
    const draft = this.draftPermissions();
    if (!id || !draft) return;
    const ok = await this.rolesService.updatePermissions(id, draft);
    if (ok) {
      this.draftPermissions.set(null);
      this.successAlert.set("Permisos guardados correctamente.");
    }
  }

  protected onCancelPermissions(): void {
    this.draftPermissions.set(null);
  }

  protected onCreate(): void {
    this.createOpen.set(true);
  }

  protected async onSaveRole(payload: { data: RoleFormData }): Promise<void> {
    const created = await this.rolesService.create({
      code: payload.data.code,
      name: payload.data.name,
      description: payload.data.description,
      paginaInicioId: payload.data.paginaInicioId,
    });
    if (created) {
      this.createOpen.set(false);
      this.selectedId.set(created.id);
      this.draftPermissions.set(null);
      this.successAlert.set(
        `Rol "${created.name}" creado. Asigna sus permisos.`,
      );
      void this.rolesService.loadPermissionsForRole(created.id);
    }
  }

  protected onEditRole(): void {
    const r = this.selectedRole();
    if (!r || r.sistema) return;
    this.editTargetId.set(r.id);
  }

  protected async onSaveEdit(payload: {
    id: string;
    nombre: string;
    descripcion: string;
    paginaInicioId: string;
  }): Promise<void> {
    const updated = await this.rolesService.update(payload.id, {
      nombre: payload.nombre,
      descripcion: payload.descripcion,
      paginaInicioId: payload.paginaInicioId,
    });
    if (updated) {
      this.editTargetId.set(null);
      this.successAlert.set(`Rol "${updated.name}" actualizado.`);
    }
  }

  protected onRequestDelete(): void {
    const r = this.selectedRole();
    if (!r || r.sistema) return;
    this.deleteTargetId.set(r.id);
  }

  protected async onConfirmDelete(payload: {
    id: string;
    motivoEliminacion: string;
  }): Promise<void> {
    const ok = await this.rolesService.delete(
      payload.id,
      payload.motivoEliminacion,
    );
    if (ok) {
      this.deleteTargetId.set(null);
      const remaining = this.roles();
      if (this.selectedId() === payload.id) {
        this.selectedId.set(remaining[0]?.id ?? null);
        if (remaining[0]) {
          void this.rolesService.loadPermissionsForRole(remaining[0].id);
        }
      }
      this.successAlert.set("Rol eliminado.");
    }
  }

  protected onDismissAlert(): void {
    this.successAlert.set(null);
  }

  protected permissionCountLabel(): string {
    const count = this.effectivePermissions().length;
    return `${count} de ${this.totalModules()} módulos`;
  }
}
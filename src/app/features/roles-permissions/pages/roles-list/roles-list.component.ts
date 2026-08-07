import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import {
  IconCheckLargeComponent,
  IconPlusSimpleComponent,
} from "@shared/icons";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiCardComponent } from "@shared/ui/card";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";

import { PermissionsMatrixComponent } from "../../components/permissions-matrix/permissions-matrix.component";
import { RoleFormModalComponent } from "../../components/role-form-modal/role-form-modal.component";
import { RoleListPanelComponent } from "../../components/role-list-panel/role-list-panel.component";
import type { Role, RoleFormData } from "../../models/role";
import { SYSTEM_MODULES } from "../../models/role";
import { RolesService } from "../../services/roles.service";

@Component({
  selector: "RolesListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    PermissionsMatrixComponent,
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
    void this.rolesService.cargar();
  }

  protected readonly plusIcon = IconPlusSimpleComponent;
  protected readonly checkIcon = IconCheckLargeComponent;

  protected readonly breadcrumbItems = [
    { label: "Administración" },
    { label: "Roles" },
  ];

  protected readonly roles = this.rolesService.roles;

  protected readonly selectedId = signal<string | null>(null);
  protected readonly draftPermissions = signal<string[] | null>(null);

  protected readonly selectedRole = computed<Role | null>(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.roles().find((r) => r.id === id) ?? null;
  });

  /** Permisos efectivos (en edición) o los actuales del rol (cache local). */
  protected readonly effectivePermissions = computed<string[]>(() => {
    const draft = this.draftPermissions();
    if (draft) return draft;
    const id = this.selectedId();
    if (!id) return [];
    return this.rolesService.getPermissionsForRole(id);
  });

  protected readonly moduleCount = computed<number>(() => SYSTEM_MODULES.length);

  protected readonly canEditSelected = computed<boolean>(() => {
    const r = this.selectedRole();
    return !!r && r.kind === "custom";
  });

  protected readonly hasChanges = computed<boolean>(
    () => this.draftPermissions() !== null,
  );

  protected readonly createOpen = signal<boolean>(false);
  protected readonly successAlert = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.selectedId() === null && this.roles().length > 0) {
        this.selectedId.set(this.roles()[0].id);
      }
    });
  }

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
      code: payload.data.code.trim().toUpperCase(),
      name: payload.data.name.trim(),
      description: payload.data.description.trim(),
      permissions: [],
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

  protected onDismissAlert(): void {
    this.successAlert.set(null);
  }

  protected permissionCountLabel(): string {
    const r = this.selectedRole();
    if (!r) return `0 de ${this.moduleCount()} módulos`;
    const count = this.effectivePermissions().length;
    return `${count} de ${this.moduleCount()} módulos`;
  }
}

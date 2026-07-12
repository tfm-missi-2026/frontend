import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  input,
  output,
} from "@angular/core";

import { UiAlertComponent } from "@shared/ui/alert";
import { UiAvatarComponent } from "@shared/ui/avatar";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { UiTableComponent } from "@shared/ui/table";
import type { TableCellContext, TableColumn } from "@shared/ui/table";

import type { User } from "../../models/user";
import { USER_ROLE_LABELS, userFullName } from "../../models/user";

const PAGE_SIZE = 6;

@Component({
  selector: "UsersTable",
  standalone: true,
  imports: [
    UiAlertComponent,
    UiAvatarComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiSurfaceComponent,
    UiTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #codeCell let-user>
      <UiLabel
        type="bodyXs"
        weight="semibold"
        color="textWeak"
        [text]="user.id.toUpperCase()"
        className="font-mono"
      />
    </ng-template>

    <ng-template #nameCell let-user>
      <UiFlex direction="row" alignItems="center" [gap]="3" className="min-w-56">
        <UiAvatar
          [src]="avatarUrl(user)"
          [alt]="fullName(user)"
          size="small"
          [status]="user.status === 'active' ? 'online' : 'offline'"
        />
        <UiLabel
          type="bodyS"
          weight="semibold"
          color="textStrong"
          [text]="fullName(user)"
        />
      </UiFlex>
    </ng-template>

    <ng-template #emailCell let-user>
      <UiLabel
        type="bodyXs"
        color="textWeak"
        [text]="user.email"
        className="font-mono"
      />
    </ng-template>

    <ng-template #roleCell let-user>
      <UiBadge variant="light" color="primary" size="sm">
        {{ roleLabel(user.role) }}
      </UiBadge>
    </ng-template>

    <ng-template #statusCell let-user>
      @if (user.status === "active") {
        <UiBadge variant="light" color="success" size="sm">
          <UiLabel
            type="bodyXs"
            color="textStrong"
            text="●"
            className="mr-1 text-success-500"
            [ariaHidden]="true"
          />
          Activo
        </UiBadge>
      } @else {
        <UiBadge variant="light" color="error" size="sm">
          <UiLabel
            type="bodyXs"
            color="textStrong"
            text="○"
            className="mr-1 text-error-500"
            [ariaHidden]="true"
          />
          Inactivo
        </UiBadge>
      }
    </ng-template>

    <ng-template #actionsCell let-user>
      <UiFlex
        direction="row"
        alignItems="center"
        justifyContent="end"
        [gap]="1"
        className="whitespace-nowrap"
      >
        <UiButton
          variant="tertiary"
          [transparent]="true"
          [compact]="true"
          labelText="Editar"
          (click)="edit.emit(user)"
        />
        <UiButton
          variant="tertiary"
          [transparent]="true"
          [compact]="true"
          labelText="Restablecer contraseña"
          (click)="resetPassword.emit(user)"
        />
        <UiButton
          variant="tertiary"
          styleType="danger"
          [transparent]="true"
          [compact]="true"
          labelText="Dar de baja"
          [disabled]="user.status === 'inactive'"
          (click)="deactivate.emit(user)"
        />
      </UiFlex>
    </ng-template>

    @if (users().length === 0) {
      <UiSurface
        variant="neutral"
        padding="none"
        className="rounded-2xl border-dashed border-gray-300 bg-white px-5 py-14 dark:border-gray-700 dark:bg-white/3"
      >
        <UiFlex direction="column" [gap]="0" className="mx-auto max-w-2xl">
          <UiAlert
            variant="info"
            title="No hay usuarios que coincidan con el filtro"
            message="Prueba a limpiar la búsqueda o ajustar los filtros de rol y estado."
          />
          <UiFlex
            direction="row"
            alignItems="center"
            justifyContent="center"
            [gap]="2"
            className="mt-4 flex-wrap"
          >
            <UiButton
              variant="secondary"
              labelText="Limpiar filtros"
              (click)="clearFilters.emit()"
            />
            <UiButton
              variant="primary"
              labelText="Nuevo usuario"
              (click)="create.emit()"
            />
          </UiFlex>
        </UiFlex>
      </UiSurface>
    } @else {
      <UiTable
        [columns]="tableColumns(codeCell, nameCell, emailCell, roleCell, statusCell, actionsCell)"
        [data]="users()"
        [hasActions]="false"
        [paginated]="true"
        [pageSize]="pageSize"
        trackByKey="id"
      />
    }
  `,
})
export class UsersTableComponent {
  readonly users = input<User[]>([]);

  readonly edit = output<User>();
  readonly resetPassword = output<User>();
  readonly deactivate = output<User>();
  readonly clearFilters = output<void>();
  readonly create = output<void>();

  protected readonly pageSize = PAGE_SIZE;

  protected tableColumns(
    codeCell: TemplateRef<TableCellContext<User>>,
    nameCell: TemplateRef<TableCellContext<User>>,
    emailCell: TemplateRef<TableCellContext<User>>,
    roleCell: TemplateRef<TableCellContext<User>>,
    statusCell: TemplateRef<TableCellContext<User>>,
    actionsCell: TemplateRef<TableCellContext<User>>,
  ): TableColumn<User>[] {
    return [
      { key: "id", header: "Código", width: "100px", cell: codeCell },
      { key: "firstName", header: "Nombre completo", width: "240px", cell: nameCell },
      { key: "email", header: "Correo electrónico", width: "280px", cell: emailCell },
      { key: "role", header: "Rol", width: "180px", cell: roleCell },
      { key: "status", header: "Estado", width: "120px", cell: statusCell },
      {
        key: "actions",
        header: "Acciones",
        width: "320px",
        align: "end",
        searchable: false,
        cell: actionsCell,
      },
    ];
  }

  protected fullName(user: User): string {
    return userFullName(user);
  }

  protected roleLabel(role: User["role"]): string {
    return USER_ROLE_LABELS[role];
  }

  protected avatarUrl(user: User): string {
    const numericId = Number(user.id.replace(/\D/g, "")) || 1;
    const avatarNumber = ((numericId - 1) % 24) + 1;
    return `/images/user/user-${String(avatarNumber).padStart(2, "0")}.jpg`;
  }
}

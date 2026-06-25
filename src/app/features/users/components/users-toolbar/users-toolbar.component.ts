import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IconSearchLightComponent } from "@shared/icons";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiInputComponent } from "@shared/ui/input";
import { UiSelectComponent } from "@shared/ui/select";

import type { SelectOption } from "@shared/ui/select/select.interface";

import type { UserRole, UserStatus } from "../../models/user";

/**
 * `UsersToolbarComponent`
 * -----------------------
 * Barra de filtros de la página de gestión de usuarios. Contiene el
 * input de búsqueda, el filtro por rol y el filtro por estado.
 *
 * Componente presentacional sin estado: el padre controla los valores
 * vía inputs y escucha los cambios vía outputs. Standalone + OnPush +
 * signal API.
 */
@Component({
  selector: "UsersToolbar",
  standalone: true,
  imports: [FormsModule, UiFlexComponent, UiInputComponent, UiSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiFlex
      direction="row"
      alignItems="center"
      gap="12px"
      className="flex-wrap"
    >
      <UiInput
        className="flex-1 min-w-70"
        type="text"
        placeholder="Buscar por nombre o correo…"
        [leftIcon]="searchIcon"
        [value]="searchTerm()"
        (valueChange)="searchChange.emit($event)"
      />

      <UiSelect
        [options]="rolOptions()"
        [searchable]="false"
        [isClearable]="true"
        placeholder="Rol: Todos"
        [width]="'170px'"
        [ngModel]="rolValue()"
        (ngModelChange)="rolChange.emit(asString($event))"
      />

      <UiSelect
        [options]="statusOptions()"
        [searchable]="false"
        [isClearable]="true"
        placeholder="Estado: Todos"
        [width]="'160px'"
        [ngModel]="statusValue()"
        (ngModelChange)="statusChange.emit(asString($event))"
      />
    </UiFlex>
  `,
})
export class UsersToolbarComponent {
  readonly searchTerm = input<string>("");
  readonly rolValue = input<string | null>(null);
  readonly statusValue = input<string | null>(null);
  readonly rolOptions = input<SelectOption[]>([]);
  readonly statusOptions = input<SelectOption[]>([]);

  readonly searchChange = output<string>();
  readonly rolChange = output<string | null>();
  readonly statusChange = output<string | null>();

  protected readonly searchIcon = IconSearchLightComponent;

  protected asString(value: unknown): string | null {
    if (value === null || value === undefined || value === "") return null;
    return String(value);
  }
}

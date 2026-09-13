import {
  ChangeDetectionStrategy,
  Component,
  Type,
  input,
  output,
} from "@angular/core";

import { UiFlexComponent } from "@shared/ui/flex/flex.component";
import { UiInputComponent } from "@shared/ui/input/input/input.component";
import { UiLabelComponent } from "@shared/ui/label";

/**
 * `UiTableToolbar`
 *
 * Sub-componente del UiTable que renderiza el header con titulo,
 * descripcion, buscador y slot para acciones globales (slot
 * `[table-actions]`).
 *
 * Emite `searchChange` con el termino; el consumer lo mapea a
 * `BaseQueryParams.setSearch(...)`.
 */
@Component({
  selector: "UiTableToolbar",
  standalone: true,
  imports: [UiFlexComponent, UiInputComponent, UiLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./table-toolbar.component.html",
})
export class UiTableToolbarComponent {
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly searchable = input<boolean>(false);
  readonly searchPlaceholder = input<string>("Buscar…");
  readonly searchValue = input<string>("");
  readonly searchIcon = input<Type<unknown> | undefined>(undefined);

  readonly searchChange = output<string>();
}

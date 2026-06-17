import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { NgClass } from "@angular/common";
import { RouterModule } from "@angular/router";

import { DropdownItemTag } from "../dropdown.types";

const DEFAULT_BASE_CLASSES =
  "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900";

/**
 * `UiDropdownItem`
 * ----------------
 * Item de menú para usar dentro de un `UiDropdown`. Renderiza un
 * `<button>` por defecto y, opcionalmente, un `<a [routerLink]>`
 * cuando se define `to` o cuando `tag` es `"a"`.
 *
 * Uso típico:
 * ```html
 * <UiDropdownItem (itemClick)="close()">Acción</UiDropdownItem>
 * <UiDropdownItem [to]="'/profile'" (itemClick)="close()">
 *   Perfil
 * </UiDropdownItem>
 * ```
 *
 * Variantes:
 *  - `button` (default): botón nativo, no navega.
 *  - `a`: enlace con `routerLink`; `to` es obligatorio.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiDropdownItem",
  standalone: true,
  imports: [NgClass, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./dropdown-item.html",
})
export class UiDropdownItemComponent {
  /**
   * Ruta del router-link. Si se define, el item se renderiza como
   * `<a [routerLink]>` (sin importar el valor de `tag`).
   */
  readonly to = input<string | undefined>(undefined);
  /** Tag HTML a renderizar. Default: `button`. */
  readonly tag = input<DropdownItemTag>("button");
  /** Clases base aplicadas siempre al item. Default: estilos link. */
  readonly baseClassName = input<string>(DEFAULT_BASE_CLASSES);
  /** Clases extra aplicadas al item. */
  readonly className = input<string>("");
  /** Tipo del botón (cuando se renderiza como `<button>`). */
  readonly type = input<"button" | "submit" | "reset">("button");
  /** Deshabilita el item (clase + `disabled`/`aria-disabled`). */
  readonly disabled = input<boolean>(false);

  /** Alias de `itemClick` (compatibilidad con versiones previas). */
  readonly click = output<void>();
  /** Emite cuando el usuario interactúa con el item. */
  readonly itemClick = output<void>();

  /** `true` si debe renderizarse como `<a routerLink>`. */
  readonly isLink = computed<boolean>(
    () => this.tag() === "a" || !!this.to(),
  );

  readonly containerClasses = computed<string>(() =>
    [this.baseClassName(), this.className()].filter(Boolean).join(" "),
  );

  handleClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.click.emit();
    this.itemClick.emit();
  }
}

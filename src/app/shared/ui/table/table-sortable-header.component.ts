import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { UiLabelComponent } from "@shared/ui/label";

import type { TableSortDirection } from "./table.types";

/**
 * `UiTableSortableHeader`
 *
 * Sub-componente del UiTable que renderiza el <th> clickable de una
 * columna ordenable: boton con label + icono de orden (↑/↓/↕) y
 * accesibilidad (aria-label, type="button").
 *
 * Cicla el orden `null → asc → desc → null` en cada click y emite
 * `{ key, direction }` para que el consumer (UiTable) lo aplique
 * sobre el `query` signal compartido con `BaseQueryParams.setSort(...)`.
 *
 * NO conoce el resto de la tabla ni al servicio. Solo se preocupa de:
 *  1. Como se ve el icono segun el estado de sort actual.
 *  2. Cual es el siguiente estado en el ciclo.
 *  3. Accesibilidad (aria-label, type=button explicito).
 */
@Component({
  selector: "UiTableSortableHeader",
  standalone: true,
  imports: [UiLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./table-sortable-header.component.html",
})
export class UiTableSortableHeaderComponent {
  readonly label = input.required<string>();
  readonly columnKey = input.required<string>();
  readonly sortKey = input<string | undefined>(undefined);
  readonly align = input<"start" | "center" | "end">("start");
  readonly activeSortBy = input<string | null>(null);
  readonly activeDirection = input<TableSortDirection | null>(null);

  /** Emite el nuevo par (key, direction) tras el click. */
  readonly sort = output<{ key: string; direction: TableSortDirection | null }>();

  /** `sortKey` configurado en la columna, o `columnKey` como fallback. */
  protected readonly effectiveKey = computed<string>(
    () => this.sortKey() ?? this.columnKey(),
  );

  protected readonly isActive = computed<boolean>(
    () => this.activeSortBy() === this.effectiveKey(),
  );

  protected readonly icon = computed<string>(() => {
    if (this.isActive()) {
      return this.activeDirection() === "desc" ? "↓" : "↑";
    }
    return "↕";
  });

  protected readonly justifyClass = computed<string>(() => {
    const a = this.align();
    if (a === "end") return "justify-end";
    if (a === "center") return "justify-center";
    return "justify-start";
  });

  protected readonly iconClass = computed<string>(() =>
    this.isActive()
      ? "text-brand-600 dark:text-brand-400"
      : "text-gray-300 dark:text-gray-600",
  );

  protected onClick(): void {
    const key = this.effectiveKey();
    const currentBy = this.activeSortBy();
    const currentDir = this.activeDirection();
    let next: TableSortDirection | null;
    if (currentBy !== key) {
      next = "asc";
    } else if (currentDir === "asc") {
      next = "desc";
    } else if (currentDir === "desc") {
      next = null;
    } else {
      next = "asc";
    }
    this.sort.emit({ key, direction: next });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  Type,
  computed,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { UiFlexComponent } from "@shared/ui/flex/flex.component";
import { UiIconButtonComponent } from "@shared/ui/icon-button/icon-button.component";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";

/**
 * `UiTablePaginationFooter`
 *
 * Sub-componente del UiTable que renderiza el footer de paginacion:
 * "Mostrando X-Y de Z" + selector de "Filas por pagina" (opcional) +
 * chevron prev/next + label "N / total".
 *
 * NO conoce al query signal: solo emite eventos. El consumer (UiTable)
 * los traduce a `BaseQueryParams.setPage(prevPage|nextPage|pageSize)`.
 */
@Component({
  selector: "UiTablePaginationFooter",
  standalone: true,
  imports: [
    FormsModule,
    UiFlexComponent,
    UiIconButtonComponent,
    UiLabelComponent,
    UiSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./table-pagination-footer.component.html",
})
export class UiTablePaginationFooterComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly rangeLabel = input.required<string>();
  readonly pageSizeOptions = input<number[]>([]);
  readonly currentPageSize = input.required<number>();

  readonly prevIcon = input.required<Type<unknown>>();
  readonly nextIcon = input.required<Type<unknown>>();

  readonly prevPage = output<void>();
  readonly nextPage = output<void>();
  /** Emite el nuevo `pageSize` (number). */
  readonly pageSizeSelect = output<number>();

  protected readonly pageSizeOptions$ = computed<SelectOption[]>(() =>
    this.pageSizeOptions().map((n) => ({ value: n, label: String(n) })),
  );

  protected readonly showPageSizeSelector = computed<boolean>(
    () => this.pageSizeOptions().length > 0,
  );

  protected onPrevPage(): void {
    if (this.currentPage() === 1) return;
    this.prevPage.emit();
  }

  protected onNextPage(): void {
    if (this.currentPage() === this.totalPages()) return;
    this.nextPage.emit();
  }

  protected onPageSizeSelect(value: unknown): void {
    if (value === null || value === undefined) return;
    const n = Number(value);
    if (!Number.isFinite(n) || n < 1) return;
    this.pageSizeSelect.emit(n);
  }
}

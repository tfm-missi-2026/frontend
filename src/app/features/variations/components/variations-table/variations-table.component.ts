import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  viewChild,
  TemplateRef,
} from "@angular/core";

import { BaseQueryParams } from "@core/query-params";
import { IconCheckComponent, IconEyeComponent } from "@shared/icons";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiTableComponent } from "@shared/ui/table";
import type { TableCellContext, TableColumn } from "@shared/ui/table";
import { formatShortDate } from "@utils/date";

import type { Variation } from "../../models/variation";

export interface VariationRowViewModel extends Variation {
  targetLabel: string;
  targetRef: string | null;
}

type Cell = TemplateRef<TableCellContext<VariationRowViewModel>>;

@Component({
  selector: "VariationsTable",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./variations-table.component.html",
})
export class VariationsTableComponent {
  readonly rows = input<VariationRowViewModel[]>([]);
  readonly emptyText = input<string>("No hay variaciones.");

  readonly view = output<Variation>();
  readonly resolve = output<Variation>();

  protected readonly query = signal(new BaseQueryParams({ pageSize: 100 }));

  protected readonly viewIcon = IconEyeComponent;
  protected readonly resolveIcon = IconCheckComponent;

  private readonly tareaCell = viewChild.required<Cell>("tareaCell");
  private readonly tipoCell = viewChild.required<Cell>("tipoCell");
  private readonly descripcionCell = viewChild.required<Cell>("descripcionCell");
  private readonly reportadaCell = viewChild.required<Cell>("reportadaCell");
  private readonly deteccionCell = viewChild.required<Cell>("deteccionCell");
  private readonly situacionCell = viewChild.required<Cell>("situacionCell");
  private readonly accionesCell = viewChild.required<Cell>("accionesCell");

  protected readonly columns = computed<TableColumn<VariationRowViewModel>[]>(
    () => [
      {
        key: "targetLabel",
        header: "Tarea afectada",
        width: "240px",
        cell: this.tareaCell(),
      },
      {
        key: "type",
        header: "Tipo",
        width: "120px",
        align: "center",
        cell: this.tipoCell(),
      },
      {
        key: "description",
        header: "Descripción",
        cell: this.descripcionCell(),
      },
      {
        key: "reportedBy",
        header: "Reportada por",
        width: "180px",
        cell: this.reportadaCell(),
      },
      {
        key: "detectionDate",
        header: "Detección",
        width: "130px",
        cell: this.deteccionCell(),
      },
      {
        key: "status",
        header: "Situación",
        width: "140px",
        align: "center",
        cell: this.situacionCell(),
      },
      {
        key: "actions",
        header: "Acciones",
        width: "140px",
        align: "end",
        cell: this.accionesCell(),
      },
    ],
  );

  protected formatDate(iso: string): string {
    return formatShortDate(iso);
  }

  protected statusBadgeVariant(status: Variation["status"]): "light" | "solid" {
    return status === "Pendiente" ? "light" : "solid";
  }

  protected statusBadgeColor(
    status: Variation["status"],
  ): "warning" | "success" | "error" {
    if (status === "Pendiente") return "warning";
    if (status === "Aprobada") return "success";
    return "error";
  }

  protected isPending(v: VariationRowViewModel): boolean {
    return v.status === "Pendiente";
  }
}

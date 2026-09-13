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
import { IconEditPencilComponent, IconTrashComponent } from "@shared/icons";
import { UiBadgeComponent } from "@shared/ui/badge";
import type { BadgeColor } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { UiTableComponent } from "@shared/ui/table";
import type { TableCellContext, TableColumn } from "@shared/ui/table";
import { formatDateRange } from "@utils/date";

import type { Assignment } from "../../models/assignment";

export interface AssignmentRowViewModel extends Assignment {
  resourceName: string;
  resourceRole: string;
  taskName: string;
  subprojectName: string;
  subprojectPriority: string | null;
}

type Cell = TemplateRef<TableCellContext<AssignmentRowViewModel>>;

const PRIORITY_COLOR: Record<string, BadgeColor> = {
  Alta: "error",
  Media: "warning",
  Baja: "success",
};

@Component({
  selector: "PlanningTable",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiSurfaceComponent,
    UiTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./planning-table.component.html",
})
export class PlanningTableComponent {
  readonly rows = input<AssignmentRowViewModel[]>([]);
  readonly emptyText = input<string>("No hay asignaciones.");

  readonly edit = output<Assignment>();
  readonly remove = output<Assignment>();

  protected readonly query = signal(new BaseQueryParams({ pageSize: 100 }));

  protected readonly editIcon = IconEditPencilComponent;
  protected readonly trashIcon = IconTrashComponent;

  private readonly recursoCell = viewChild.required<Cell>("recursoCell");
  private readonly tareaCell = viewChild.required<Cell>("tareaCell");
  private readonly subproyectoCell = viewChild.required<Cell>("subproyectoCell");
  private readonly horasCell = viewChild.required<Cell>("horasCell");
  private readonly periodoCell = viewChild.required<Cell>("periodoCell");
  private readonly accionesCell = viewChild.required<Cell>("accionesCell");

  protected initials(name: string): string {
    return name
      .split(" ")
      .filter((part) => part.length > 0)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }

  protected readonly columns = computed<TableColumn<AssignmentRowViewModel>[]>(
    () => [
      {
        key: "resourceName",
        header: "Recurso técnico",
        width: "260px",
        cell: this.recursoCell(),
      },
      { key: "taskName", header: "Tarea", cell: this.tareaCell() },
      {
        key: "subprojectName",
        header: "Subproyecto",
        width: "240px",
        cell: this.subproyectoCell(),
      },
      {
        key: "plannedHours",
        header: "Horas planif.",
        width: "140px",
        align: "center",
        cell: this.horasCell(),
      },
      {
        key: "period",
        header: "Periodo",
        width: "220px",
        cell: this.periodoCell(),
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

  protected formatPeriod(row: AssignmentRowViewModel): string {
    return formatDateRange(row.startDate, row.endDate);
  }

  protected priorityColor(row: AssignmentRowViewModel): BadgeColor {
    return PRIORITY_COLOR[row.subprojectPriority ?? ""] ?? "primary";
  }
}

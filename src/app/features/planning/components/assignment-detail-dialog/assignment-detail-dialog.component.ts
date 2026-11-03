import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";

import { IconXComponent } from "@shared/icons";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { formatDateRange } from "@utils/date";

import type { AssignmentRowViewModel } from "../planning-table/planning-table.component";

@Component({
  selector: "AssignmentDetailDialog",
  standalone: true,
  imports: [
    UiFlexComponent,
    UiLabelComponent,
    UiModalComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./assignment-detail-dialog.component.html",
})
export class AssignmentDetailDialogComponent {
  readonly row = input.required<AssignmentRowViewModel>();

  readonly close = output<void>();

  protected readonly IconX = IconXComponent;

  protected readonly fields = computed(() => {
    const r = this.row();
    return [
      { label: "Recurso técnico", value: r.resourceName },
      { label: "Tarea", value: r.taskName },
      { label: "Subproyecto", value: r.subprojectName },
      { label: "Prioridad", value: r.subprojectPriority ?? "—" },
      { label: "Días", value: String(r.taskDays) },
      { label: "Horas planificadas", value: `${r.plannedHours} h` },
      { label: "Periodo", value: formatDateRange(r.startDate, r.endDate) },
    ];
  });
}

import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";

import { IconXComponent } from "@shared/icons";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { formatDateRange } from "@utils/date";

import type { Task } from "../../models/task";

@Component({
  selector: "TaskDetailDialog",
  standalone: true,
  imports: [
    UiFlexComponent,
    UiLabelComponent,
    UiModalComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./task-detail-dialog.component.html",
})
export class TaskDetailDialogComponent {
  readonly task = input.required<Task>();
  readonly resourceName = input<string>("");

  readonly close = output<void>();

  protected readonly IconX = IconXComponent;

  protected readonly fields = computed(() => {
    const t = this.task();
    return [
      { label: "Nombre", value: t.name },
      { label: "Descripción", value: t.description || "—" },
      { label: "Recurso asignado", value: this.resourceName() || "—" },
      { label: "Días", value: String(t.estimatedDays) },
      { label: "Horas estimadas", value: `${t.estimatedHours} h` },
      { label: "Periodo", value: formatDateRange(t.startDate, t.endDate) },
      { label: "Situación", value: t.situation },
      { label: "Origen", value: t.originLabel },
    ];
  });
}

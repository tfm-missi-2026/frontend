import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";

import type { ManagerPeriod } from "../period/manager-period";

@Component({
  selector: "CommonPeriodSelector",
  standalone: true,
  imports: [FormsModule, UiFlexComponent, UiSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./period-selector.component.html",
})
export class CommonPeriodSelectorComponent {
  readonly periods = input.required<ManagerPeriod[]>();
  readonly periodId = input.required<string>();

  readonly periodChange = output<string>();

  protected readonly periodOptions = (): SelectOption[] =>
    this.periods().map((p) => ({ value: p.id, label: p.label }));

  protected asString(value: unknown): string {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) {
      const first = value[0];
      return first === undefined || first === null ? "" : String(first);
    }
    return String(value);
  }
}

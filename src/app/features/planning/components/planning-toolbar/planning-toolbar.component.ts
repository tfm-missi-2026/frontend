import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";

@Component({
  selector: "PlanningToolbar",
  standalone: true,
  imports: [
    FormsModule,
    UiButtonComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./planning-toolbar.component.html",
})
export class PlanningToolbarComponent {
  readonly projectOptions = input<SelectOption[]>([]);
  readonly projectId = input<string | null>(null);
  readonly canFreeze = input<boolean>(false);

  readonly projectChange = output<string | null>();
  readonly freeze = output<void>();

  protected asString(value: unknown): string | null {
    if (value === null || value === undefined) return null;
    if (Array.isArray(value)) {
      const first = value[0];
      return first === undefined || first === null ? null : String(first);
    }
    const text = String(value);
    return text === "" ? null : text;
  }
}
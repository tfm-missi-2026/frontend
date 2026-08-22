import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";

@Component({
  selector: "ProgressToolbar",
  standalone: true,
  imports: [FormsModule, UiFlexComponent, UiFormLabelComponent, UiSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./progress-toolbar.component.html",
})
export class ProgressToolbarComponent {
  readonly projectOptions = input<SelectOption[]>([]);
  readonly projectId = input<string | null>(null);

  readonly projectChange = output<string | null>();

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

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSelectComponent } from "@shared/ui/select";
import { UiSurfaceComponent } from "@shared/ui/surface";
import type { SelectOption } from "@shared/ui/select";

@Component({
  selector: "TeamLoadToolbar",
  standalone: true,
  imports: [
    FormsModule,
    UiButtonComponent,
    UiFlexComponent,
    UiFormLabelComponent,
    UiInputComponent,
    UiLabelComponent,
    UiSelectComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./team-load-toolbar.component.html",
})
export class TeamLoadToolbarComponent {
  readonly fromIso = input<string>("2026-05-01");
  readonly toIso = input<string>("2026-05-31");
  readonly projectOptions = input<SelectOption[]>([]);
  readonly projectId = input<string | null>(null);

  readonly fromChange = output<string>();
  readonly toChange = output<string>();
  readonly projectChange = output<string | null>();
  readonly consult = output<void>();

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

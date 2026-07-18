import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IconSearchLightComponent } from "@shared/icons";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiInputComponent } from "@shared/ui/input";
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";

@Component({
  selector: "VariationsToolbar",
  standalone: true,
  imports: [
    FormsModule,
    UiFlexComponent,
    UiInputComponent,
    UiSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./variations-toolbar.component.html",
})
export class VariationsToolbarComponent {
  readonly searchTerm = input<string>("");
  readonly typeOptions = input<SelectOption[]>([]);
  readonly typeValue = input<string | null>(null);
  readonly statusOptions = input<SelectOption[]>([]);
  readonly statusValue = input<string | null>(null);

  readonly searchChange = output<string>();
  readonly typeChange = output<string | null>();
  readonly statusChange = output<string | null>();

  protected readonly IconSearchLightComponent = IconSearchLightComponent;

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

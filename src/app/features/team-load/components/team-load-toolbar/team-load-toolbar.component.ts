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
import { todayIso } from "@utils/date";

function mesActual(): { inicio: string; fin: string } {
  const [y, m] = todayIso().split("-").map(Number);
  const ultimoDia = new Date(y, m, 0).getDate();
  const mm = String(m).padStart(2, "0");
  return {
    inicio: `${y}-${mm}-01`,
    fin: `${y}-${mm}-${String(ultimoDia).padStart(2, "0")}`,
  };
}

const MES = mesActual();

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
  readonly fromIso = input<string>(MES.inicio);
  readonly toIso = input<string>(MES.fin);
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

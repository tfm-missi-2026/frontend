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
import type {
  SubprojectActiveFilter,
  SubprojectSituation,
  SubprojectType,
} from "../../models/subproject";

@Component({
  selector: "ProjectsSubprojectsToolbar",
  standalone: true,
  imports: [
    FormsModule,
    UiFlexComponent,
    UiInputComponent,
    UiSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./projects-subprojects-toolbar.component.html",
})
export class ProjectsSubprojectsToolbarComponent {
  readonly searchTerm = input<string>("");
  readonly typeValue = input<SubprojectType | null>(null);
  readonly typeOptions = input<SelectOption[]>([]);
  readonly situationValue = input<SubprojectSituation | null>(null);
  readonly situationOptions = input<SelectOption[]>([]);
  readonly activeValue = input<SubprojectActiveFilter | null>(null);
  readonly activeOptions = input<SelectOption[]>([]);

  readonly searchChange = output<string>();
  readonly typeChange = output<SubprojectType | null>();
  readonly situationChange = output<SubprojectSituation | null>();
  readonly activeChange = output<SubprojectActiveFilter | null>();
  readonly clearFilters = output<void>();

  protected readonly IconSearchLightComponent = IconSearchLightComponent;

  protected asType(value: unknown): SubprojectType | null {
    const text = this.asString(value);
    return text ? (text as SubprojectType) : null;
  }

  protected asSituation(value: unknown): SubprojectSituation | null {
    const text = this.asString(value);
    return text ? (text as SubprojectSituation) : null;
  }

  protected asActive(value: unknown): SubprojectActiveFilter | null {
    const text = this.asString(value);
    return text ? (text as SubprojectActiveFilter) : null;
  }

  private asString(value: unknown): string | null {
    if (value === null || value === undefined) return null;
    if (Array.isArray(value)) {
      const first = value[0];
      return first === undefined || first === null ? null : String(first);
    }
    const text = String(value);
    return text === "" ? null : text;
  }
}
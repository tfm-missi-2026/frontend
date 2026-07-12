import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { IconSearchLightComponent } from "@shared/icons";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiInputComponent } from "@shared/ui/input";

@Component({
  selector: "CatalogToolbar",
  standalone: true,
  imports: [UiFlexComponent, UiInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiFlex
      direction="row"
      alignItems="center"
      [gap]="12"
      className="flex-wrap"
    >
      <UiInput
        className="flex-1 min-w-70"
        type="text"
        placeholder="Buscar por código o nombre…"
        [leftIcon]="searchIcon"
        [value]="searchTerm()"
        (valueChange)="searchChange.emit($event)"
      />
    </UiFlex>
  `,
})
export class CatalogToolbarComponent {
  readonly searchTerm = input<string>("");
  readonly searchChange = output<string>();

  protected readonly searchIcon = IconSearchLightComponent;
}
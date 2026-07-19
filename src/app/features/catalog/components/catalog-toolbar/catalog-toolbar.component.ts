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
  templateUrl: "./catalog-toolbar.component.html",
})
export class CatalogToolbarComponent {
  readonly searchTerm = input<string>("");
  readonly searchChange = output<string>();

  protected readonly searchIcon = IconSearchLightComponent;
}
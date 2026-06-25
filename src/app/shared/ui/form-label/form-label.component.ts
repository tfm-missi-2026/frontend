import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { UiLabelComponent } from "@shared/ui/label/label.component";
import { UiInfoIconWithTooltipComponent } from "@shared/ui/info-icon-with-tooltip/info-icon-with-tooltip.component";
import { FontWeightType } from "@styles/types/typography";

/**
 * Etiqueta semántica para formularios. Renderiza el `<label for>` real
 * vía `<UiLabel>` y, opcionalmente, un asterisco `*` cuando `required`
 * y un tooltip de ayuda. El asterisco se oculta si `disabled` o
 * `readOnly`. El wrapper es `<span>` (no `<label>`) para evitar
 * `<label><label>` anidado, ya que `UiLabel` ahora es `<label>`.
 */
@Component({
  selector: "UiFormLabel",
  standalone: true,
  imports: [UiLabelComponent, UiInfoIconWithTooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="inline-flex items-center gap-1">
      <UiLabel
        [for]="labelFor()"
        type="bodyS"
        [text]="labelText()"
        [weight]="weight() ?? 'medium'"
        [wrapText]="wrapText()"
      ></UiLabel>
      @if (showRequired()) {
        <span aria-hidden="true" class="text-error-500 dark:text-error-400">*</span>
      }
      @if (tooltip()) {
        <InfoIconWithTooltip [tooltip]="tooltip() ?? ''"></InfoIconWithTooltip>
      }
    </span>
  `,
})
export class UiFormLabelComponent {
  readonly labelText = input<string>("");
  readonly labelFor = input<string>("");
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly readOnly = input<boolean>(false);
  readonly weight = input<FontWeightType | undefined>(undefined);
  readonly wrapText = input<boolean>(false);
  readonly tooltip = input<string | undefined>(undefined);

  readonly showRequired = computed<boolean>(
    () => this.required() && !this.disabled() && !this.readOnly(),
  );
}

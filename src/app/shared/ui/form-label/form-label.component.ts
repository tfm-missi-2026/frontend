import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { UiFlexComponent } from "@shared/ui/flex/flex.component";
import { UiLabelComponent } from "@shared/ui/label/label.component";
import { FontWeightType } from "@styles/types/typography";
import { UiInfoIconWithTooltipComponent } from "@shared/ui/info-icon-with-tooltip/info-icon-with-tooltip.component";

/**
 * `UiFormLabel`
 * -------------
 * Etiqueta semántica asociada a un input por su `id` (atributo `for`).
 *
 * Capacidades:
 *  - Texto del label vía `<UiLabel type="bodyS">`.
 *  - Asterisco `*` obligatorio cuando `required` y no `disabled`/`readOnly`.
 *  - Tooltip opcional vía `<UiInfoIconWithTooltip>`.
 *  - `gap` interno = 4px entre el label y `*`.
 *  - `gap` externo (cuando hay tooltip) = 4px entre el bloque label y
 *    el icono de tooltip.
 */
@Component({
  selector: "UiFormLabel",
  standalone: true,
  imports: [
    NgTemplateOutlet,
    UiFlexComponent,
    UiLabelComponent,
    UiInfoIconWithTooltipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tooltip(); as t) {
      <UiFlex [alignItems]="'center'" [gap]="'4px'">
        <ng-container *ngTemplateOutlet="labelTpl"></ng-container>
        <InfoIconWithTooltip [tooltip]="t"></InfoIconWithTooltip>
      </UiFlex>
    } @else {
      <ng-container *ngTemplateOutlet="labelTpl"></ng-container>
    }

    <ng-template #labelTpl>
      <label
        [attr.for]="labelFor()"
        class="form-label inline-flex items-center gap-1"
      >
        <UiLabel
          type="bodyS"
          [text]="labelText()"
          [weight]="weight() ?? 'medium'"
          [wrapText]="wrapText()"
        ></UiLabel>
        @if (showRequired()) {
          <span aria-hidden="true">*</span>
        }
      </label>
    </ng-template>
  `,
})
export class UiFormLabelComponent {
  /** Texto del label. */
  readonly labelText = input<string>("");
  /** `id` del input al que se asocia (atributo `for` del HTML). */
  readonly labelFor = input<string>("");
  /** Muestra el asterisco `*`. Se oculta si `disabled` o `readOnly`. */
  readonly required = input<boolean>(false);
  /** Estado disabled — oculta el asterisco. */
  readonly disabled = input<boolean>(false);
  /** Estado readOnly — oculta el asterisco. */
  readonly readOnly = input<boolean>(false);
  /** `font-weight` del texto. Default: `'medium'`. */
  readonly weight = input<FontWeightType | undefined>(undefined);
  /** Si `true`, el texto puede hacer wrap. */
  readonly wrapText = input<boolean>(false);
  /** Tooltip opcional. Si se define, se renderiza el icono de ayuda. */
  readonly tooltip = input<string | undefined>(undefined);

  readonly showRequired = computed<boolean>(
    () => this.required() && !this.disabled() && !this.readOnly(),
  );
}

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { FlexComponent } from '@ui/flex/flex';
import { LabelComponent } from '@ui/label/label';
import { FontWeightType } from '@styles/types/typography';
import { InfoIconWithTooltipComponent } from '@ui/info-icon-with-tooltip/info-icon-with-tooltip';

/**
 * `FormLabel`
 * -----------
 * Etiqueta semántica asociada a un input por su `id` (atributo `for`).
 * Réplica Angular del `FormLabel` del proyecto React (styled-components).
 *
 * Capacidades:
 *  - Texto del label vía `<Label type="bodyS">`.
 *  - Asterisco `*` obligatorio cuando `required` y no `disabled`/`readOnly`.
 *  - Tooltip opcional vía `<InfoIconWithTooltip>`.
 *  - `gap` interno = `designConstants.spacing[1]` (4px) entre el label y `*`.
 *  - `gap` externo (cuando hay tooltip) = `designConstants.spacing[1]` (4px)
 *    entre el bloque label y el icono de tooltip.
 */
@Component({
  selector: 'FormLabel',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    FlexComponent,
    LabelComponent,
    InfoIconWithTooltipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tooltip) {
      <Flex [alignItems]="'center'" [gap]="'4px'">
        <ng-container *ngTemplateOutlet="labelTpl"></ng-container>
        <InfoIconWithTooltip [tooltip]="tooltip"></InfoIconWithTooltip>
      </Flex>
    } @else {
      <ng-container *ngTemplateOutlet="labelTpl"></ng-container>
    }

    <ng-template #labelTpl>
      <label
        [attr.for]="labelFor"
        class="form-label inline-flex items-center gap-1"
      >
        <Label
          type="bodyS"
          [text]="labelText"
          [weight]="weight ?? 'medium'"
          [wrapText]="wrapText"
        ></Label>
        @if (showRequired) {
          <span aria-hidden="true">*</span>
        }
      </label>
    </ng-template>
  `,
})
export class FormLabelComponent {
  // -------------------------------------------------------------------------
  // Inputs
  // -------------------------------------------------------------------------

  /** Texto del label. */
  @Input() labelText = '';
  /** `id` del input al que se asocia (atributo `for` del HTML). */
  @Input() labelFor = '';

  /** Muestra el asterisco `*`. Se oculta si `disabled` o `readOnly`. */
  @Input() required = false;
  /** Estado disabled — oculta el asterisco. */
  @Input() disabled = false;
  /** Estado readOnly — oculta el asterisco. */
  @Input() readOnly = false;

  /** `font-weight` del texto. Default: `'medium'`. */
  @Input() weight?: FontWeightType;
  /** Si `true`, el texto puede hacer wrap. */
  @Input() wrapText = false;

  /** Tooltip opcional. Si se define, se renderiza el icono de ayuda. */
  @Input() tooltip?: string;

  // -------------------------------------------------------------------------
  // ViewChild
  // -------------------------------------------------------------------------

  @ViewChild('labelTpl', { static: true }) labelTpl!: TemplateRef<unknown>;

  // -------------------------------------------------------------------------
  // Getters
  // -------------------------------------------------------------------------

  get showRequired(): boolean {
    return this.required && !this.disabled && !this.readOnly;
  }
}

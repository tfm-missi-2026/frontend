import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { IconValidationErrorComponent } from "@shared/icons";

/**
 * `ValidationErrorIcon`
 * ---------------------
 * Wrapper del `IconValidationError` con la semántica específica del
 * `UiInput`: el mensaje de error completo se expone como `title` nativo
 * (tooltip del navegador) y como `aria-label`.
 *
 * Réplica Angular del `ValidationErrorIcon` del proyecto React.
 */
@Component({
  selector: "ValidationErrorIcon",
  standalone: true,
  imports: [IconValidationErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center text-error-500 shrink-0"
      [attr.title]="errorMessage() || null"
      aria-label="Error"
      data-testid="input-error-icon"
    >
      <IconValidationError [size]="size()" />
    </span>
  `,
})
export class ValidationErrorIconComponent {
  /** Mensaje de error a mostrar en el tooltip nativo. */
  readonly errorMessage = input<string>("");
  /** Tamaño del icono (en px). Por defecto `14`. */
  readonly size = input<number | string>(14);
}

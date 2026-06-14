import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/**
 * `ValidationErrorIcon`
 * ---------------------
 * Icono de error que se muestra a la derecha del input cuando hay
 * `errorMessage`. El mensaje completo aparece como `title` nativo al
 * hacer hover (mismo patrón que el `Select` del design system).
 *
 * Réplica Angular del `ValidationErrorIcon` del proyecto React.
 */
@Component({
  selector: 'ValidationErrorIcon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center text-error-500 shrink-0"
      [attr.title]="errorMessage() || null"
      aria-label="Error"
      data-testid="input-error-icon"
    >
      <svg
        [attr.width]="size()"
        [attr.height]="size()"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="7"
          cy="7"
          r="6"
          stroke="currentColor"
          stroke-width="1.2"
        />
        <path
          d="M7 4V7.5"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
        />
        <circle cx="7" cy="9.6" r="0.7" fill="currentColor" />
      </svg>
    </span>
  `,
})
export class ValidationErrorIconComponent {
  /** Mensaje de error a mostrar en el tooltip nativo. */
  readonly errorMessage = input<string>('');
  /** Tamaño del icono (en px). Por defecto `14`. */
  readonly size = input<number | string>(14);
}

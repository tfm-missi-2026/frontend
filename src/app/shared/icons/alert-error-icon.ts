import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconAlertError`
 * ----------------
 * "X" (38×38) usado como ícono central del alert de error/peligro en
 * los modales de alerta (`ModalBasedAlerts`).
 *
 * A diferencia de los demás íconos de alert, este no tiene un círculo
 * decorativo (la X ya se renderiza grande), y se posiciona sobre el
 * `IconAlertBlob`.
 *
 * El color se controla con clases Tailwind pasadas vía `className`
 * (ej. `fill-error-600 dark:fill-error-500`).
 */
@Component({
  selector: 'IconAlertError',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 38 38"
      fill="none"
      aria-hidden="true"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      style="flex-shrink: 0; display: inline-block;"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.62684 11.7496C9.04105 11.1638 9.04105 10.2141 9.62684 9.6283C10.2126 9.04252 11.1624 9.04252 11.7482 9.6283L18.9985 16.8786L26.2485 9.62851C26.8343 9.04273 27.7841 9.04273 28.3699 9.62851C28.9556 10.2143 28.9556 11.164 28.3699 11.7498L21.1198 18.9999L28.3699 26.25C28.9556 26.8358 28.9556 27.7855 28.3699 28.3713C27.7841 28.9571 26.8343 28.9571 26.2485 28.3713L18.9985 21.1212L11.7482 28.3715C11.1624 28.9573 10.2126 28.9573 9.62684 28.3715C9.04105 27.7857 9.04105 26.836 9.62684 26.2502L16.8771 18.9999L9.62684 11.7496Z"
        fill="currentColor"
      />
    </svg>
  `,
})
export class IconAlertErrorComponent {
  readonly size = input<number | string>(38);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

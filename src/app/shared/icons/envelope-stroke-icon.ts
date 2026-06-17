import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * `IconEnvelopeStroke`
 * --------------------
 * Sobre (18×18) versión stroke-based usado en el item "Receipt Email
 * Sent" del timeline de `OrderHistory`.
 *
 * A diferencia de `IconEnvelope` (20×20, fill-based, color fijo), esta
 * versión es stroke-based y se controla con `currentColor` para poder
 * integrarse con la paleta del timeline.
 */
@Component({
  selector: 'IconEnvelopeStroke',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth()"
      [attr.height]="computedHeight()"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      [attr.data-testid]="dataTestId() || null"
      [attr.class]="className() || null"
      [style.color]="color()"
      style="flex-shrink: 0; display: inline-block;"
    >
      <path
        d="M15.9375 4.67548V12.9375C15.9375 13.5588 15.4338 14.0625 14.8125 14.0625H3.1875C2.56618 14.0625 2.0625 13.5588 2.0625 12.9375V4.67548M2.80194 3.9375H15.1983C15.6066 3.9375 15.9375 4.26843 15.9376 4.67669C15.9376 4.91843 15.8195 5.14491 15.6212 5.28318L9.64374 9.45142C9.25711 9.72103 8.7434 9.72103 8.35676 9.45142L2.37912 5.28304C2.18095 5.14485 2.06282 4.91854 2.06274 4.67694C2.06261 4.2686 2.3936 3.9375 2.80194 3.9375Z"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class IconEnvelopeStrokeComponent {
  readonly size = input<number | string>(18);
  readonly width = input<number | string | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly color = input<string>('currentColor');
  readonly className = input<string>('');
  readonly dataTestId = input<string | undefined>(undefined);
  readonly style = input<Record<string, unknown> | undefined>(undefined);

  readonly computedWidth = computed(() => this.width() ?? this.size());
  readonly computedHeight = computed(() => this.height() ?? this.size());
}

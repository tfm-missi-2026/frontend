import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { IconCircleInfoLightComponent } from "@shared/ui/icon/circle-info-icon-light";
import { UiTooltipComponent } from "@shared/ui/tooltip/tooltip";

/**
 * `UiInfoIconWithTooltip`
 * -----------------------
 * Muestra un `UiIconCircleInfoLight` con un tooltip al hacer hover.
 *
 * Comportamiento:
 *  - El `tooltip` puede ser un texto plano.
 *  - Se controla con `color` (cualquier valor CSS o `currentColor`).
 *  - Detiene la propagación del click para no interferir con el padre.
 *
 * Usa el componente `UiTooltip` del design system.
 */
@Component({
  selector: "InfoIconWithTooltip",
  standalone: true,
  imports: [UiTooltipComponent, IconCircleInfoLightComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiTooltip
      [content]="tooltip()"
      [variant]="variant()"
      [side]="side()"
      [sideOffset]="sideOffset()"
      [align]="align()"
      [delayDuration]="delayDuration()"
      [className]="tooltipClassName()"
    >
      <button
        type="button"
        class="inline-flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer"
        [class]="triggerClassName()"
        (click)="stopPropagation($event)"
        [attr.aria-label]="tooltip() || null"
      >
        <IconCircleInfoLight
          [size]="size()"
          [color]="color()"
          [dataTestId]="dataTestId()"
        />
      </button>
    </UiTooltip>
  `,
})
export class UiInfoIconWithTooltipComponent {
  /** Texto del tooltip. */
  readonly tooltip = input<string>("");
  /** Color del icono (CSS color). Por defecto `currentColor`. */
  readonly color = input<string>("currentColor");
  /** Tamaño del icono. */
  readonly size = input<number | string>(12);
  /** `data-testid` que se delega al icono. */
  readonly dataTestId = input<string | undefined>(undefined);
  /** Clases extra para el contenedor exterior. */
  readonly className = input<string>("");
  /** Clases para el botón disparador. */
  readonly triggerClassName = input<string>(
    "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
  );
  /** Variante del tooltip. */
  readonly variant = input<"light" | "dark">("light");
  /** Lado del tooltip. */
  readonly side = input<"top" | "right" | "bottom" | "left">("bottom");
  /** Distancia (px) entre el tooltip y el icono. */
  readonly sideOffset = input<number>(8);
  /** Alineación del tooltip. */
  readonly align = input<"start" | "center" | "end">("start");
  /** Retraso (ms) para mostrar el tooltip. */
  readonly delayDuration = input<number>(200);

  readonly tooltipClassName = computed<string>(() => this.className());

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}

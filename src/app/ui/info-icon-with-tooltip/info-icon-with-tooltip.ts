import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CircleInfoIconLightComponent } from '@ui/icon/circle-info-icon-light';
import { TooltipComponent } from '@ui/tooltip/tooltip';

/**
 * `InfoIconWithTooltip`
 * --------------------
 * Muestra un `IconCircleInfoLight` con un tooltip al hacer hover.
 *
 * Comportamiento:
 *  - El `tooltip` puede ser un texto plano.
 *  - Se controla con `color` (cualquier valor CSS o `currentColor`).
 *  - Detiene la propagación del click para no interferir con el padre.
 *
 * Usa el componente `Tooltip` del design system.
 */
@Component({
  selector: 'InfoIconWithTooltip',
  standalone: true,
  imports: [CommonModule, CircleInfoIconLightComponent, TooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <Tooltip
      [content]="tooltip"
      [variant]="variant"
      [side]="side"
      [sideOffset]="sideOffset"
      [align]="align"
      [delayDuration]="delayDuration"
      [className]="tooltipClassName"
    >
      <button
        type="button"
        class="inline-flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer"
        [ngClass]="triggerClassName"
        (click)="stopPropagation($event)"
        [attr.aria-label]="tooltip || null"
      >
        <IconCircleInfoLight
          [size]="size"
          [color]="color"
          [dataTestId]="dataTestId"
        />
      </button>
    </Tooltip>
  `,
})
export class InfoIconWithTooltipComponent {
  /** Texto del tooltip. */
  @Input() tooltip = '';
  /** Color del icono (CSS color). Por defecto `currentColor`. */
  @Input() color = 'currentColor';
  /** Tamaño del icono. */
  @Input() size: number | string = 12;
  /** `data-testid` que se delega al icono. */
  @Input() dataTestId?: string;
  /** Clases extra para el contenedor exterior. */
  @Input() className = '';
  /** Clases para el botón disparador. */
  @Input() triggerClassName =
    'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
  /** Variante del tooltip. */
  @Input() variant: 'light' | 'dark' = 'light';
  /** Lado del tooltip. */
  @Input() side: 'top' | 'right' | 'bottom' | 'left' = 'bottom';
  /** Distancia (px) entre el tooltip y el icono. */
  @Input() sideOffset = 8;
  /** Alineación del tooltip. */
  @Input() align: 'start' | 'center' | 'end' = 'start';
  /** Retraso (ms) para mostrar el tooltip. */
  @Input() delayDuration = 200;

  get tooltipClassName(): string {
    return this.className;
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}

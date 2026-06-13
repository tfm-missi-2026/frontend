import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconProps } from './icon.interface';

/**
 * `IconCircleInfoLight`
 * --------------------
 * Icono "info" dentro de un círculo.
 *
 * Usa `currentColor` para el `fill`, por lo que se controla con la
 * propiedad `color` o con la clase de color del padre.
 */
@Component({
  selector: 'IconCircleInfoLight',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth"
      [attr.height]="computedHeight"
      viewBox="0 0 16 16"
      [attr.data-testid]="dataTestId || null"
      [ngClass]="className"
      [style.color]="color"
      [style.flexShrink]="0"
      [style.display]="'inline-block'"
    >
      <path
        d="M8.25 1C10.1065 1 11.887 1.7375 13.1997 3.05025C14.5125 4.36301 15.25 6.14348 15.25 8C15.25 9.85652 14.5125 11.637 13.1997 12.9497C11.887 14.2625 10.1065 15 8.25 15C6.39348 15 4.61301 14.2625 3.30025 12.9497C1.9875 11.637 1.25 9.85652 1.25 8C1.25 6.14348 1.9875 4.36301 3.30025 3.05025C4.61301 1.7375 6.39348 1 8.25 1ZM8.25 16C10.3717 16 12.4066 15.1571 13.9069 13.6569C15.4071 12.1566 16.25 10.1217 16.25 8C16.25 5.87827 15.4071 3.84344 13.9069 2.34315C12.4066 0.842855 10.3717 0 8.25 0C6.12827 0 4.09344 0.842855 2.59315 2.34315C1.09285 3.84344 0.25 5.87827 0.25 8C0.25 10.1217 1.09285 12.1566 2.59315 13.6569C4.09344 15.1571 6.12827 16 8.25 16ZM6.75 11C6.475 11 6.25 11.225 6.25 11.5C6.25 11.775 6.475 12 6.75 12H9.75C10.025 12 10.25 11.775 10.25 11.5C10.25 11.225 10.025 11 9.75 11H8.75V7.5C8.75 7.225 8.525 7 8.25 7H7C6.725 7 6.5 7.225 6.5 7.5C6.5 7.775 6.725 8 7 8H7.75V11H6.75ZM8.25 5.75C8.44891 5.75 8.63968 5.67098 8.78033 5.53033C8.92098 5.38968 9 5.19891 9 5C9 4.80109 8.92098 4.61032 8.78033 4.46967C8.63968 4.32902 8.44891 4.25 8.25 4.25C8.05109 4.25 7.86032 4.32902 7.71967 4.46967C7.57902 4.61032 7.5 4.80109 7.5 5C7.5 5.19891 7.57902 5.38968 7.71967 5.53033C7.86032 5.67098 8.05109 5.75 8.25 5.75Z"
        fill="currentColor"
      />
    </svg>
  `,
})
export class CircleInfoIconLightComponent implements IconProps {
  @Input() size: number | string = 16;
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() color = 'currentColor';
  @Input() className = '';
  @Input() dataTestId?: string;

  get computedWidth(): number | string {
    return this.width ?? this.size;
  }

  get computedHeight(): number | string {
    return this.height ?? this.size;
  }
}
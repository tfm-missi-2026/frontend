import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

/**
 * Tipo equivalente a `CSSProperties['flexDirection']`.
 * Soporta todos los valores estándar de `flex-direction`.
 */
export type FlexDirection =
  | 'row'
  | 'row-reverse'
  | 'column'
  | 'column-reverse'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'revert-layer'
  | 'unset';

/**
 * `Flex`
 * ------
 * Contenedor `display: flex` parametrizable.
 * Las "custom props" no se filtran al DOM porque en Angular los `@Input`
 * no se reenvían como atributos HTML.
 */
@Component({
  selector: 'Flex',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './flex.html',
  styleUrls: ['./flex.css'],
})
export class FlexComponent {
  /** Dirección del eje principal. */
  @Input() direction: FlexDirection = 'row';
  /** `justify-content` (CSS). */
  @Input() justifyContent?: string;
  /** `align-items` (CSS). */
  @Input() alignItems?: string;
  /** `gap` (CSS). */
  @Input() gap?: string;
  /** `flex` shorthand (CSS). */
  @Input() flex?: string;
  /** `overflow` (CSS). */
  @Input() overflow?: string;
  /** Si `true`, `flex-wrap: nowrap` (por defecto `wrap`). */
  @Input() noWrap = false;
  /** Si `true`, añade `min-width: 0` (row) o `min-height: 0` (column). */
  @Input() shrinkable = false;
  /** Clases extra para el contenedor. */
  @Input() className = '';

  get classes(): string {
    return `flex ${this.className}`.trim();
  }

  get styles(): Record<string, string> {
    return {
      display: 'flex',
      'flex-direction': this.direction,
      'flex-wrap': this.noWrap ? 'nowrap' : 'wrap',
      overflow: this.overflow ?? '',
      flex: this.flex ?? '',
      gap: this.gap ?? '',
      'justify-content': this.justifyContent ?? '',
      'align-items': this.alignItems ?? '',
      ...(this.shrinkable
        ? this.direction === 'row'
          ? { 'min-width': '0' }
          : { 'min-height': '0' }
        : {}),
    };
  }
}

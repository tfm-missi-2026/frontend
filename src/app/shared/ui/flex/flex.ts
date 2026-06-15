import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

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
 * `UiFlex`
 * --------
 * Contenedor `display: flex` parametrizable.
 * Las "custom props" no se filtran al DOM porque en Angular los
 * `input()` signals no se reenvían como atributos HTML.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: 'UiFlex',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="classes()" [style]="styles()">
      <ng-content />
    </div>
  `,
})
export class UiFlexComponent {
  /** Dirección del eje principal. */
  readonly direction = input<FlexDirection>('row');
  /** `justify-content` (CSS). */
  readonly justifyContent = input<string | undefined>(undefined);
  /** `align-items` (CSS). */
  readonly alignItems = input<string | undefined>(undefined);
  /** `gap` (CSS). */
  readonly gap = input<string | undefined>(undefined);
  /** `flex` shorthand (CSS). */
  readonly flex = input<string | undefined>(undefined);
  /** `overflow` (CSS). */
  readonly overflow = input<string | undefined>(undefined);
  /** Si `true`, `flex-wrap: nowrap` (por defecto `wrap`). */
  readonly noWrap = input<boolean>(false);
  /** Si `true`, añade `min-width: 0` (row) o `min-height: 0` (column). */
  readonly shrinkable = input<boolean>(false);
  /** Clases extra para el contenedor. */
  readonly className = input<string>('');

  /** Clases del contenedor (`flex` + extras del consumidor). */
  readonly classes = computed<string>(() => `flex ${this.className()}`.trim());

  /** Estilos inline del contenedor. */
  readonly styles = computed<Record<string, string>>(() => {
    const dir = this.direction();
    return {
      display: 'flex',
      'flex-direction': dir,
      'flex-wrap': this.noWrap() ? 'nowrap' : 'wrap',
      overflow: this.overflow() ?? '',
      flex: this.flex() ?? '',
      gap: this.gap() ?? '',
      'justify-content': this.justifyContent() ?? '',
      'align-items': this.alignItems() ?? '',
      ...(this.shrinkable()
        ? dir === 'row'
          ? { 'min-width': '0' }
          : { 'min-height': '0' }
        : {}),
    };
  });
}

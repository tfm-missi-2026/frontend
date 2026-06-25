import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonStyleType, ButtonVariant, UiButtonComponent } from '@shared/ui/button';
import { TypographyType } from '@styles/constants';
import { CommonTabGroupSize, CommonTabOption } from './tab-group.types';

/**
 * `CommonTabGroup`
 * ----------------
 * Segmented control genérico.
 *
 * Renderiza una fila de botones (uno por tab) usando `UiButton` del
 * design system. El consumidor pasa los tabs vía `tabs` y opcionalmente
 * el id seleccionado (modo controlado).
 *
 * Modos:
 *  - **Uncontrolled** (default): si no se pasa `selectedId`, el
 *    componente mantiene estado interno y se inicializa al primer
 *    tab no-disabled.
 *  - **Controlled**: si se pasa `selectedId`, el componente es
 *    "tonto" y sólo emite `selectedChange`. El padre decide qué
 *    hacer con el evento.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: 'CommonTabGroup',
  standalone: true,
  imports: [UiButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab-group.component.html',
})
export class CommonTabGroupComponent<TId extends string = string> {
  /** Lista de tabs a renderizar. Requerido. */
  readonly tabs = input.required<CommonTabOption<TId>[]>();

  /**
   * Id del tab actualmente seleccionado (modo controlado).
   * Si se omite, el componente es uncontrolled y mantiene estado
   * interno inicializado al primer tab no deshabilitado.
   */
  readonly selectedId = input<TId | undefined>(undefined);

  /** Botones a ancho igual (true) o ancho por contenido (false). */
  readonly fullWidth = input<boolean>(true);

  /** Tamaño visual. Default `'md'`. */
  readonly size = input<CommonTabGroupSize>('md');

  /** `aria-label` para el contenedor `role="tablist"`. */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** Clases extra aplicadas al contenedor. */
  readonly className = input<string>('');

  /** Emite el `value` del tab seleccionado. */
  readonly selectedChange = output<TId>();

  /** Estado interno — sólo se usa en modo uncontrolled. */
  private readonly _internalSelected = signal<TId | undefined>(undefined);

  /**
   * Id efectivo con fallback al primer tab no-disabled.
   *
   *  - Si el consumidor pasó `selectedId`, ese gana (modo controlado).
   *  - Si no, se usa el estado interno.
   *  - Como salvaguarda, si el id resuelto no está en `tabs()` o
   *    corresponde a un tab disabled, cae al primer tab no-disabled.
   *  - Si no hay tabs no-disabled, devuelve `undefined`.
   */
  readonly effectiveSelected = computed<TId | undefined>(() => {
    const list = this.tabs();
    if (!list || list.length === 0) return undefined;

    const fromInput = this.selectedId();
    const candidate =
      fromInput !== undefined ? fromInput : this._internalSelected();

    if (candidate !== undefined) {
      const found = list.find((t) => t.value === candidate && !t.disabled);
      if (found) return found.value;
    }
    return list.find((t) => !t.disabled)?.value;
  });

  readonly containerClasses = computed<string>(() => {
    const extra = this.className();
    return [
      'flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900',
      extra,
    ]
      .filter(Boolean)
      .join(' ');
  });

  onTabClick(tab: CommonTabOption<TId>): void {
    if (tab.disabled) return;
    if (this.selectedId() === undefined) {
      this._internalSelected.set(tab.value);
    }
    this.selectedChange.emit(tab.value);
  }

  isSelected(tab: CommonTabOption<TId>): boolean {
    return this.effectiveSelected() === tab.value;
  }

  /**
   * Variant del `UiButton` para el tab.
   * - `secondary` cuando seleccionado (da el pill blanco con borde sutil).
   * - `tertiary` cuando idle (botón plano).
   */
  buttonVariant(tab: CommonTabOption<TId>): ButtonVariant {
    return this.isSelected(tab) ? 'secondary' : 'tertiary';
  }

  /** StyleType fijo en `monochrome` para mantener el lenguaje gris. */
  buttonStyleType(): ButtonStyleType {
    return 'monochrome';
  }

  /** Tipografía del `UiButton` según el `size` del grupo. */
  buttonFontSize(): TypographyType {
    return this.size() === 'sm' ? 'bodyXxs' : 'bodyS';
  }

  /** `className` adicional cuando el tab está seleccionado (sombra). */
  buttonExtraClassName(tab: CommonTabOption<TId>): string {
    return this.isSelected(tab) ? 'shadow-theme-xs' : '';
  }

  /** `tabindex` siguiendo el patrón WAI-ARIA de roving tabindex. */
  buttonTabIndex(tab: CommonTabOption<TId>): number {
    return this.isSelected(tab) ? 0 : -1;
  }

  /** `aria-selected` reflejado al estado de selección. */
  buttonAriaSelected(tab: CommonTabOption<TId>): 'true' | 'false' {
    return this.isSelected(tab) ? 'true' : 'false';
  }
}
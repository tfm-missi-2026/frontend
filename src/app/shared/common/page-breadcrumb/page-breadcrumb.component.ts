import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { UiLinkComponent } from '@shared/ui/link';
import { IconChevronRightSmallComponent } from '@shared/icons';

import { CommonBreadcrumbItem } from './breadcrumb.types';

/**
 * `CommonBreadcrumb`
 * ------------------
 * Breadcrumb semántico (`<nav>` + `<ol>`) del namespace `common/`.
 *
 * Dos formas de uso:
 *  - **Atajo** (`pageTitle`): genera un trail de 2 segmentos
 *    `[home, pageTitle]`. El segmento final se renderiza como
 *    `<span>` (no es link).
 *  - **Trail completo** (`items`): el consumidor pasa la lista de
 *    segmentos; cada item puede tener `route` o no. Si se pasan
 *    ambos `items` y `pageTitle`, `items` gana.
 *
 * El último segmento se marca con `aria-current="page"`. Los íconos
 * separadores son `aria-hidden="true"` (decorativos). Los segmentos
 * ruteables se renderizan con `UiLink`, que aporta `routerLink`,
 * foco accesible y slot de ícono derecho para el chevron.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: 'CommonBreadcrumb',
  standalone: true,
  imports: [UiLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      aria-label="Breadcrumb"
      [class]="containerClasses()"
    >
      <ol class="flex items-center gap-1.5">
        @for (
          item of effectiveItems();
          track $index;
          let last = $last
        ) {
          <li
            class="text-sm"
            [class]="liClasses(last)"
            [attr.aria-current]="last ? 'page' : null"
          >
            @if (item.route && !last) {
              <UiLink
                [to]="item.route"
                variant="subtle"
                size="sm"
                underline="none"
                [rightIcon]="chevron"
                [iconProps]="chevronProps"
              >
                {{ item.label }}
              </UiLink>
            } @else {
              <span>{{ item.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
})
export class CommonBreadcrumbComponent {
  /** Trail completo de segmentos. Si está vacío, se usa `pageTitle`. */
  readonly items = input<CommonBreadcrumbItem[]>([]);
  /** Atajo: genera `[home, pageTitle]` cuando `items` está vacío. */
  readonly pageTitle = input<string>('');
  /** Texto del segmento raíz. Default: `'Home'`. */
  readonly homeLabel = input<string>('Home');
  /** Ruta del segmento raíz. Default: `'/'`. */
  readonly homeRoute = input<string>('/');
  /** Clases extra aplicadas al `<nav>`. */
  readonly className = input<string>('');

  /** Componente del ícono separador (referencia, no instancia). */
  protected readonly chevron = IconChevronRightSmallComponent;

  /** Props del ícono: tamaño fijo y `stroke-current` para heredar color. */
  protected readonly chevronProps = {
    width: 17,
    height: 16,
    className: 'stroke-current',
  };

  /**
   * Trail efectivo. Prioridad:
   *  1. `items()` no vacío → se usa tal cual.
   *  2. `pageTitle()` no vacío → se genera `[home, pageTitle]`.
   *  3. Ninguno → array vacío (breadcrumb invisible).
   */
  readonly effectiveItems = computed<CommonBreadcrumbItem[]>(() => {
    const list = this.items();
    if (list && list.length > 0) return list;
    const title = this.pageTitle();
    if (title) {
      return [
        { label: this.homeLabel(), route: this.homeRoute() },
        { label: title },
      ];
    }
    return [];
  });

  readonly containerClasses = computed<string>(() => this.className());

  /** Color del texto según si el segmento es el último (current page). */
  liClasses(isLast: boolean): string {
    return isLast
      ? 'text-gray-800 dark:text-white/90'
      : 'text-gray-500 dark:text-gray-400';
  }
}
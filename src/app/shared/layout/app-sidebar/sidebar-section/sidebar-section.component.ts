import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  Type,
} from "@angular/core";
import { NgComponentOutlet } from "@angular/common";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";

import {
  SidebarLayoutNavSectionComponent,
  type NavItem,
} from "../sidebar-nav-section";

/**
 * `SidebarLayoutSectionComponent`
 * -------------------------------
 * Bloque de sección del sidebar. Compone:
 *  - Un `<UiLabel>` como título de la sección ("Menú", "Otros", etc.).
 *  - El icono representativo cuando el sidebar está colapsado.
 *  - El `<SidebarLayoutNavSection>` con los items de navegación.
 *
 * Cuando el sidebar está expandido u hover-expandido, se muestra el
 * título como label. Si está colapsado, el título se reemplaza por un
 * ícono (`sectionIcon`) alineado al centro.
 *
 * Standalone + `OnPush` + signal API.
 */
@Component({
  selector: "SidebarLayoutSection",
  standalone: true,
  imports: [
    NgComponentOutlet,
    SidebarLayoutNavSectionComponent,
    UiFlexComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiFlex direction="column" gap="4px">
      <UiLabel
        as="span"
        type="bodyXs"
        weight="medium"
        color="textWeakest"
        [className]="
          'mb-4 uppercase leading-5 flex ' +
          (isExpandedOrHovered() ? 'justify-start' : 'xl:justify-center')
        "
      >
        @if (isExpandedOrHovered()) {
          {{ title() }}
        } @else {
          <ng-container *ngComponentOutlet="sectionIcon()"></ng-container>
        }
      </UiLabel>

      <SidebarLayoutNavSection [items]="items()" [sectionKey]="sectionKey()" />
    </UiFlex>
  `,
})
export class SidebarLayoutSectionComponent {
  /** Título visible cuando el sidebar está expandido (e.g. "Menú", "Otros"). */
  readonly title = input.required<string>();
  /** Items de navegación de la sección. */
  readonly items = input.required<NavItem[]>();
  /** Prefijo único para los IDs de submenús (e.g. "main", "others"). */
  readonly sectionKey = input.required<string>();
  /** `true` cuando el sidebar está expandido u hover-expandido. */
  readonly isExpandedOrHovered = input<boolean>(true);
  /** Componente del icono que se muestra cuando el sidebar está colapsado. */
  readonly sectionIcon = input.required<Type<unknown>>();
}
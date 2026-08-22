import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Type,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NgClass } from "@angular/common";
import { RouterOutlet } from "@angular/router";

import { AuthService } from "@core/auth/auth.service";
import { ModulosService } from "@core/modulos/modulos.service";
import {
  IconChevronLeftComponent,
  IconChevronRightComponent,
} from "@shared/icons";
import { SidebarService } from "@shared/services/sidebar.service";
import { UiIconButtonComponent } from "@shared/ui/icon-button";
import { AppHeaderComponent } from "../app-header/app-header.component";
import { BackdropComponent } from "../backdrop/backdrop.component";
import { SidebarLayoutComponent } from "../app-sidebar/sidebar-layout.component";

/**
 * `AppLayoutComponent`
 * --------------------
 * Shell autenticado del SPSRT. Compone `AppHeaderComponent`,
 * `SidebarLayoutComponent`, `BackdropComponent` y el `<router-outlet>`
 * del segmento `/app/*`. Standalone + `OnPush` + signal API.
 *
 * Las clases del contenedor principal se derivan vía `computed()` del
 * estado expuesto por `SidebarService` (leído con `toSignal`). El
 * servicio sigue siendo RxJS por decisión explícita — fuera del scope
 * de este refactor.
 *
 * Al montar, dispara la carga de los módulos autorizados para el rol
 * del usuario vía `ModulosService.cargar(rolId)`. El sidebar los lee
 * reactivamente y reconstruye su árbol de navegación.
 */
@Component({
  selector: "AppLayout",
  standalone: true,
  imports: [
    NgClass,
    RouterOutlet,
    AppHeaderComponent,
    BackdropComponent,
    SidebarLayoutComponent,
    UiIconButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./app-layout.component.html",
})
export class AppLayoutComponent {
  private readonly sidebarService = inject(SidebarService);
  private readonly auth = inject(AuthService);
  private readonly modulosService = inject(ModulosService);

  protected readonly isExpanded = toSignal(this.sidebarService.isExpanded$, {
    initialValue: true,
  });
  protected readonly isHovered = toSignal(this.sidebarService.isHovered$, {
    initialValue: false,
  });
  protected readonly isMobileOpen = toSignal(
    this.sidebarService.isMobileOpen$,
    {
      initialValue: false,
    },
  );

  protected readonly containerClasses = computed<string>(() => {
    const expanded = this.isExpanded() || this.isHovered();
    const mobile = this.isMobileOpen();
    return [
      "flex-1",
      "transition-all",
      "duration-300",
      "ease-in-out",
      expanded ? "xl:ml-[290px]" : "xl:ml-[90px]",
      mobile ? "ml-0" : "",
    ]
      .filter(Boolean)
      .join(" ");
  });

  /** Icono del toggle: chevron-izquierda cuando expandido, derecha cuando colapsado. */
  protected readonly toggleIcon = computed<Type<unknown>>(() =>
    this.isExpanded() ? IconChevronLeftComponent : IconChevronRightComponent,
  );

  protected readonly toggleTooltip = computed<string>(() =>
    this.isExpanded() ? "Colapsar menú" : "Expandir menú",
  );

  /**
   * Posición `left` en píxeles del botón toggle. Como el botón usa
   * `position: fixed`, no puede depender de la geometría del
   * `<aside>` (que también es `fixed`). Se calcula a partir del
   * ancho del sidebar (290px expandido / 90px colapsado) y se
   * mueve al borde derecho del sidebar más 12px hacia el centro
   * para que se vea como un asa.
   */
  protected readonly toggleLeft = computed<string>(() => {
    const expanded = this.isExpanded() || this.isHovered();
    return expanded ? "278px" : "78px";
  });

  /**
   * Toggle del sidebar. Renderizado como hermano del `SidebarLayout`
   * (no como hijo) para que el `mouseenter` del aside no se active
   * al posicionar el cursor sobre el botón — eso era lo que
   * impedía que el click colapsara el sidebar.
   */
  protected handleToggle(): void {
    const isDesktop = window.matchMedia("(min-width: 1280px)").matches;
    if (isDesktop) {
      this.sidebarService.toggleExpanded();
      this.sidebarService.setHovered(false);
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  constructor() {
    // Cargar modulos del rol del usuario cuando hay sesion. El sidebar
    // se monta en este mismo punto y consume `modulosService.modulos()`
    // reactivamente; el guard de `ModulosService.cargar` evita refetch.
    effect(() => {
      const rolId = this.auth.rolId();
      if (rolId) {
        void this.modulosService.cargar(rolId);
      }
    });
  }
}

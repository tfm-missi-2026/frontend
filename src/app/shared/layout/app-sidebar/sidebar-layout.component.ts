import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NgClass } from "@angular/common";
import { RouterModule } from "@angular/router";

import { ModulosService } from "@core/modulos/modulos.service";
import { IconDotsVerticalComponent } from "@shared/icons";
import { UiFlexComponent } from "@shared/ui/flex";

import { SidebarService } from "../../services/sidebar.service";
import { SidebarLayoutLogoComponent } from "./sidebar-logo";
import { SidebarLayoutSectionComponent } from "./sidebar-section";
import { construirNavDesdeModulos } from "./sidebar-nav.builder";

/**
 * `SidebarLayoutComponent`
 * ------------------------
 * Sidebar autenticado del SPSRT. Renderiza el logo y la sección de
 * navegación derivada de los módulos autorizados para el rol del
 * usuario (`/api/modulos/por-rol/{rolId}`).
 *
 * Standalone + `OnPush` + signal API. El estado del sidebar
 * (expandido / hover / mobile-open) se lee del `SidebarService` vía
 * `toSignal`. El servicio sigue siendo RxJS por decisión explícita
 * (migración futura fuera del scope de este refactor).
 */
@Component({
  selector: "SidebarLayout",
  standalone: true,
  imports: [
    NgClass,
    RouterModule,
    SidebarLayoutLogoComponent,
    SidebarLayoutSectionComponent,
    UiFlexComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./sidebar-layout.component.html",
})
export class SidebarLayoutComponent {
  private readonly sidebarService = inject(SidebarService);
  private readonly modulosService = inject(ModulosService);
  private readonly destroyRef = inject(DestroyRef);

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

  protected readonly isVisible = computed<boolean>(
    () => this.isExpanded() || this.isHovered() || this.isMobileOpen(),
  );

  protected readonly isExpandedOrHovered = computed<boolean>(
    () => this.isExpanded() || this.isHovered(),
  );

  protected readonly sectionIcon = IconDotsVerticalComponent;

  // Recalcula el árbol de navegación cada vez que cambian los módulos.
  // Si el rol no devolvió módulos (cache vacía o 401) → array vacío.
  private readonly navConfig = computed(() =>
    construirNavDesdeModulos(this.modulosService.modulos()),
  );

  protected readonly navSection = computed(() => {
    const cfg = this.navConfig();
    return {
      title: cfg.title,
      sectionKey: cfg.sectionKey,
      items: cfg.items,
    };
  });

  constructor() {
    // Asegura el reset de módulos cuando el sidebar se destruye (logout
    // navega a /signin y desmonta este árbol). Evita servir módulos del
    // rol anterior a un usuario distinto en la misma sesión.
    effect(() => {
      this.destroyRef.onDestroy(() => this.modulosService.reset());
    });
  }

  protected onSidebarMouseEnter(): void {
    if (!this.isExpanded()) {
      this.sidebarService.setHovered(true);
    }
  }
}

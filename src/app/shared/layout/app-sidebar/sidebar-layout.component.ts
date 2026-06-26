import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { NgClass } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AuthService } from "@core/auth/auth.service";
import { ModulosService } from "@core/modulos/modulos.service";
import { IconDotsVerticalComponent } from "@shared/icons";
import { UiFlexComponent } from "@shared/ui/flex";

import { SidebarService } from "../../services/sidebar.service";
import { SidebarLayoutLogoComponent } from "./sidebar-logo";
import { SidebarLayoutSectionComponent } from "./sidebar-section";
import { SidebarLayoutWidgetComponent } from "./sidebar-layout-widget.component";
import {
  construirNavDesdeModulos,
  type SidebarSectionConfig,
} from "./sidebar-nav.builder";

/**
 * `SidebarLayoutComponent`
 * ------------------------
 * Sidebar autenticado del shell del SPSRT. Renderiza el logo, las
 * secciones de navegación y el widget inferior con el CTA del sistema.
 *
 * Las secciones se construyen dinámicamente desde el backend: al iniciar,
 * consulta `/api/modulos/por-rol/{rolId}` (rol del usuario logueado) y arma
 * el árbol de navegación. Así el sidebar refleja exactamente los módulos que
 * el rol tiene autorizados, sin nav hardcodeado.
 *
 * Standalone + `OnPush` + signal API. El estado del sidebar (expandido /
 * hover / mobile-open) se lee del `SidebarService` vía `toSignal`.
 */
@Component({
  selector: "SidebarLayout",
  standalone: true,
  imports: [
    NgClass,
    RouterModule,
    SidebarLayoutLogoComponent,
    SidebarLayoutSectionComponent,
    SidebarLayoutWidgetComponent,
    UiFlexComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./sidebar-layout.component.html",
})
export class SidebarLayoutComponent {
  protected readonly sidebarService = inject(SidebarService);
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

  protected readonly isVisible = computed<boolean>(
    () => this.isExpanded() || this.isHovered() || this.isMobileOpen(),
  );

  protected readonly isExpandedOrHovered = computed<boolean>(
    () => this.isExpanded() || this.isHovered(),
  );

  protected readonly sectionIcon = IconDotsVerticalComponent;

  protected readonly sections = signal<SidebarSectionConfig[]>([]);

  constructor() {
    const rolId = this.auth.rolId();
    if (rolId) {
      this.modulosService
        .listarPorRol(rolId)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (modulos) =>
            this.sections.set(construirNavDesdeModulos(modulos)),
          error: () => this.sections.set([]),
        });
    }
  }

  protected onSidebarMouseEnter(): void {
    if (!this.isExpanded()) {
      this.sidebarService.setHovered(true);
    }
  }
}

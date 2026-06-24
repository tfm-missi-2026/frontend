import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NgClass, NgComponentOutlet } from "@angular/common";
import { RouterModule } from "@angular/router";

import {
  IconBoxComponent,
  IconCardComponent,
  IconDotsVerticalComponent,
  IconSettingsComponent,
  IconUserCircleComponent,
} from "@shared/icons";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiImageComponent } from "@shared/ui/image";

import { SidebarService } from "../../services/sidebar.service";
import { SidebarLayoutLogoComponent } from "./sidebar-logo";
import { SidebarLayoutSectionComponent } from "./sidebar-section";
import { SidebarLayoutWidgetComponent } from "./sidebar-layout-widget.component";
import {
  SidebarLayoutNavSectionComponent,
  type NavItem,
} from "./sidebar-nav-section";

interface SidebarSectionConfig {
  title: string;
  sectionKey: string;
  items: NavItem[];
}

/**
 * `SidebarLayoutComponent`
 * ------------------------
 * Sidebar autenticado del shell del SPSRT. Renderiza el logo, las
 * secciones de navegación (`Administración` y `Cuenta`) vía
 * `<SidebarLayoutNavSection>` y el widget inferior con el CTA del
 * sistema.
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
    SidebarLayoutWidgetComponent,
    UiFlexComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./sidebar-layout.component.html",
})
export class SidebarLayoutComponent {
  protected readonly sidebarService = inject(SidebarService);

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

  protected readonly sections: SidebarSectionConfig[] = [
    {
      title: "Administración",
      sectionKey: "administracion",
      items: [
        {
          icon: IconUserCircleComponent,
          name: "Usuarios",
          path: "/app/administracion/usuarios",
        },
        {
          icon: IconSettingsComponent,
          name: "Roles",
          path: "/app/administracion/roles",
        },
        {
          icon: IconBoxComponent,
          name: "Catálogo",
          path: "/app/administracion/catalogo",
        },
        {
          icon: IconCardComponent,
          name: "Módulos",
          path: "/app/administracion/modulos",
          pending: true,
        },
      ],
    },
    {
      title: "Cuenta",
      sectionKey: "cuenta",
      items: [
        {
          icon: IconSettingsComponent,
          name: "Configuración",
          path: "/app/cuenta/configuracion",
          pending: true,
        },
      ],
    },
  ];

  protected onSidebarMouseEnter(): void {
    if (!this.isExpanded()) {
      this.sidebarService.setHovered(true);
    }
  }
}

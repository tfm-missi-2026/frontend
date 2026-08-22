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
import { UiFlexComponent } from "@shared/ui/flex";

import { SidebarService } from "../../services/sidebar.service";
import { SidebarLayoutLogoComponent } from "./sidebar-logo";
import { SidebarLayoutNavSectionComponent } from "./sidebar-nav-section";
import { construirNavDesdeModulos } from "./sidebar-nav.builder";

@Component({
  selector: "SidebarLayout",
  standalone: true,
  imports: [
    NgClass,
    RouterModule,
    SidebarLayoutLogoComponent,
    SidebarLayoutNavSectionComponent,
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

  protected readonly navSections = computed(() =>
    construirNavDesdeModulos(this.modulosService.modulos()),
  );

  constructor() {
    effect(() => {
      this.destroyRef.onDestroy(() => this.modulosService.reset());
    });
  }

  protected onSidebarMouseEnter(): void {
    if (!this.isExpanded()) {
      this.sidebarService.setHovered(true);
    }
  }

  protected onSidebarMouseLeave(): void {
    this.sidebarService.setHovered(false);
  }
}
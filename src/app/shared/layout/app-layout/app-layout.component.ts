import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NgClass } from "@angular/common";
import { RouterOutlet } from "@angular/router";

import { SidebarService } from "@shared/services/sidebar.service";
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./app-layout.component.html",
})
export class AppLayoutComponent {
  private readonly sidebarService = inject(SidebarService);

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
}

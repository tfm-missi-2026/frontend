import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NgClass, NgComponentOutlet } from "@angular/common";
import { RouterModule } from "@angular/router";

import { resolveIconComponent } from "@shared/icons/icon-slug.map";
import { UiLabelComponent } from "@shared/ui/label";

import { SidebarService } from "../../../services/sidebar.service";
import type { NavItem } from "./sidebar-nav.types";

@Component({
  selector: "SidebarLayoutNavSection",
  standalone: true,
  imports: [NgClass, NgComponentOutlet, RouterModule, UiLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./sidebar-nav-section.component.html",
})
export class SidebarLayoutNavSectionComponent {
  private readonly sidebarService = inject(SidebarService);

  readonly items = input.required<NavItem[]>();
  readonly sectionKey = input.required<string>();

  readonly itemSelected = output<void>();

  protected readonly isExpanded = toSignal(this.sidebarService.isExpanded$, {
    initialValue: true,
  });
  protected readonly isHovered = toSignal(this.sidebarService.isHovered$, {
    initialValue: false,
  });
  protected readonly isMobileOpen = toSignal(this.sidebarService.isMobileOpen$, {
    initialValue: false,
  });

  protected readonly isVisible = computed<boolean>(
    () => this.isExpanded() || this.isHovered() || this.isMobileOpen(),
  );

  protected readonly isExpandedOrHovered = computed<boolean>(
    () => this.isExpanded() || this.isHovered(),
  );

  protected resolveIcon(item: NavItem) {
    return resolveIconComponent(item.iconKey);
  }

  protected trackByCodigo(index: number, item: NavItem): string {
    return `${this.sectionKey()}-${item.path ?? item.name}-${index}`;
  }

  protected onItemClick(): void {
    if (this.isMobileOpen()) {
      this.sidebarService.setMobileOpen(false);
    }
    this.itemSelected.emit();
  }
}
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NgClass, NgComponentOutlet } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

import { IconChevronDownComponent } from '@shared/icons';
import { UiIconButtonComponent } from '@shared/ui/icon-button';
import { UiLabelComponent } from '@shared/ui/label';
import type { IconProps } from '@shared/icons/icon.interface';

import { SidebarService } from '../../../services/sidebar.service';
import { NavItem, SidebarSubItem } from './sidebar-nav.types';

const CHEVRON_BASE_PROPS: IconProps = {
  width: 20,
  height: 20,
  className: 'stroke-current',
};

/**
 * `SidebarLayoutNavSection`
 * -------------------------
 * Sección colapsable del sidebar (e.g. "Menú" u "Otros"). Renderiza
 * una lista de items, donde cada item puede ser un enlace directo o
 * un grupo colapsable con sub-items.
 *
 * El estado de visibilidad (expandido, hover, abierto en móvil) se
 * obtiene del `SidebarService` vía `toSignal`, igual que el resto del
 * shell. Cuando el usuario hace click en un sub-item en mobile, emite
 * `itemSelected` para que el padre cierre el sidebar.
 *
 * El submenú que contiene la ruta activa se abre automáticamente en
 * cada `NavigationEnd`.
 *
 * Standalone + `OnPush` + signal API.
 */
@Component({
  selector: 'SidebarLayoutNavSection',
  standalone: true,
  imports: [
    NgClass,
    NgComponentOutlet,
    RouterModule,
    UiIconButtonComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar-nav-section.component.html',
})
export class SidebarLayoutNavSectionComponent implements OnInit {
  private readonly sidebarService = inject(SidebarService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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

  protected readonly openKey = signal<string | null>(null);
  private readonly subMenuHeights: { [key: string]: number } = {};

  protected readonly isVisible = computed<boolean>(
    () => this.isExpanded() || this.isHovered() || this.isMobileOpen(),
  );

  protected readonly isExpandedOrHovered = computed<boolean>(
    () => this.isExpanded() || this.isHovered(),
  );

  protected readonly chevronIcon = IconChevronDownComponent;

  protected chevronIconProps(isOpen: boolean): IconProps {
    const extra = isOpen ? 'rotate-180 text-brand-500' : '';
    return {
      ...CHEVRON_BASE_PROPS,
      className: [CHEVRON_BASE_PROPS.className, extra].filter(Boolean).join(' '),
    };
  }

  ngOnInit(): void {
    this.openSubmenuForRoute(this.router.url);
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.openSubmenuForRoute(event.urlAfterRedirects);
        }
      });
  }

  protected isItemOpen(index: number): boolean {
    return this.openKey() === this.navKey(index);
  }

  protected submenuHeight(index: number): number {
    return this.subMenuHeights[this.navKey(index)] ?? 0;
  }

  protected toggleSubmenu(index: number): void {
    const key = this.navKey(index);
    if (this.openKey() === key) {
      this.openKey.set(null);
      this.subMenuHeights[key] = 0;
    } else {
      this.openKey.set(key);
      queueMicrotask(() => {
        const el = document.getElementById(key);
        if (el) {
          this.subMenuHeights[key] = el.scrollHeight;
        }
      });
    }
  }

  protected isActive(path: string): boolean {
    return this.router.url === path;
  }

  protected onSubmenuClick(): void {
    if (this.isMobileOpen()) {
      this.sidebarService.setMobileOpen(false);
    }
    this.itemSelected.emit();
  }

  protected trackByIndex(index: number): number {
    return index;
  }

  protected trackSubItem(_index: number, item: SidebarSubItem): string {
    return item.path;
  }

  private navKey(index: number): string {
    return `${this.sectionKey()}-${index}`;
  }

  private openSubmenuForRoute(url: string): void {
    const sectionPrefix = this.sectionKey();
    const list = this.items();
    for (let i = 0; i < list.length; i++) {
      const nav = list[i];
      if (!nav.subItems) continue;
      const match = nav.subItems.some((sub) => sub.path === url);
      if (match) {
        const key = `${sectionPrefix}-${i}`;
        this.openKey.set(key);
        queueMicrotask(() => {
          const el = document.getElementById(key);
          if (el) {
            this.subMenuHeights[key] = el.scrollHeight;
          }
        });
        return;
      }
    }
  }
}
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidebarService } from '../../services/sidebar.service';
import { CommonThemeToggleComponent } from '@shared/common/theme-toggle';
import {
  HeaderNotificationDropdownComponent,
  HeaderUserDropdownComponent,
  type HeaderNotificationItem,
  type HeaderUserInfo,
  type HeaderUserMenuItem,
} from '@shared/header';
import {
  IconDotsVerticalComponent,
  IconHamburgerComponent,
  IconInfoCircleBorderComponent,
  IconLogoutComponent,
  IconSearchComponent,
  IconSettingsComponent,
  IconUserCircleComponent,
  IconXLargeComponent,
} from '@shared/icons';
import { UiFlexComponent } from '@shared/ui/flex';
import { UiIconButtonComponent } from '@shared/ui/icon-button';
import { UiImageComponent } from '@shared/ui/image';

const CURRENT_USER: HeaderUserInfo = {
  name: 'Musharof Chowdhury',
  email: 'randomuser@pimjo.com',
  avatar: '/images/user/owner.png',
};

const USER_MENU_ITEMS: HeaderUserMenuItem[] = [
  { to: '/profile', icon: IconUserCircleComponent, label: 'Editar perfil' },
  { to: '/profile', icon: IconSettingsComponent, label: 'Configuración de la cuenta' },
  { to: '/profile', icon: IconInfoCircleBorderComponent, label: 'Soporte' },
];

const SIGN_OUT_ITEM: HeaderUserMenuItem = {
  to: '/signin',
  icon: IconLogoutComponent,
  label: 'Cerrar sesión',
};

const NOTIFICATIONS: HeaderNotificationItem[] = [
  {
    actor: { name: 'Terry Franci', avatar: '/images/user/user-02.jpg' },
    action: 'solicita permiso para modificar',
    target: 'Proyecto - Nganter App',
    category: 'Proyecto',
    time: 'hace 5 min',
    status: 'online',
  },
  {
    actor: { name: 'Alena Franci', avatar: '/images/user/user-03.jpg' },
    action: 'solicita permiso para modificar',
    target: 'Proyecto - Nganter App',
    category: 'Proyecto',
    time: 'hace 8 min',
    status: 'online',
  },
  {
    actor: { name: 'Jocelyn Kenter', avatar: '/images/user/user-04.jpg' },
    action: 'solicita permiso para modificar',
    target: 'Proyecto - Nganter App',
    category: 'Proyecto',
    time: 'hace 15 min',
    status: 'online',
  },
  {
    actor: { name: 'Brandon Philips', avatar: '/images/user/user-05.jpg' },
    action: 'solicita permiso para modificar',
    target: 'Proyecto - Nganter App',
    category: 'Proyecto',
    time: 'hace 1 hora',
    status: 'offline',
    to: '/',
  },
  {
    actor: { name: 'Terry Franci', avatar: '/images/user/user-02.jpg' },
    action: 'solicita permiso para modificar',
    target: 'Proyecto - Nganter App',
    category: 'Proyecto',
    time: 'hace 5 min',
    status: 'online',
  },
  {
    actor: { name: 'Alena Franci', avatar: '/images/user/user-03.jpg' },
    action: 'solicita permiso para modificar',
    target: 'Proyecto - Nganter App',
    category: 'Proyecto',
    time: 'hace 8 min',
    status: 'online',
  },
  {
    actor: { name: 'Jocelyn Kenter', avatar: '/images/user/user-04.jpg' },
    action: 'solicita permiso para modificar',
    target: 'Proyecto - Nganter App',
    category: 'Proyecto',
    time: 'hace 15 min',
    status: 'online',
  },
  {
    actor: { name: 'Brandon Philips', avatar: '/images/user/user-05.jpg' },
    action: 'solicita permiso para modificar',
    target: 'Proyecto - Nganter App',
    category: 'Proyecto',
    time: 'hace 1 hora',
    status: 'offline',
  },
];

/**
 * `AppHeaderComponent`
 * --------------------
 * Header autenticado del shell. Contiene el toggle del sidebar, el
 * logo mobile, el toggle del application menu, el search global y los
 * dropdowns de notificaciones / usuario + theme toggle.
 *
 * Standalone + `OnPush` + signal API. El estado del sidebar se lee
 * del `SidebarService` vía `toSignal`. El servicio sigue siendo RxJS
 * por decisión explícita (migración fuera del scope de este refactor).
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    RouterModule,
    CommonThemeToggleComponent,
    HeaderNotificationDropdownComponent,
    HeaderUserDropdownComponent,
    IconSearchComponent,
    UiFlexComponent,
    UiIconButtonComponent,
    UiImageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  private readonly sidebarService = inject(SidebarService);

  protected readonly isMobileOpen = toSignal(this.sidebarService.isMobileOpen$, {
    initialValue: false,
  });

  protected readonly isApplicationMenuOpen = signal(false);

  protected readonly currentUser = CURRENT_USER;
  protected readonly userMenuItems = USER_MENU_ITEMS;
  protected readonly signOutItem = SIGN_OUT_ITEM;
  protected readonly notifications = NOTIFICATIONS;

  protected readonly hamburgerIcon = IconHamburgerComponent;
  protected readonly closeIcon = IconXLargeComponent;
  protected readonly dotsIcon = IconDotsVerticalComponent;
  protected readonly searchIcon = IconSearchComponent;

  protected readonly searchInput =
    viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected readonly mobileToggleBgClass = computed<string>(() =>
    this.isMobileOpen() ? 'bg-gray-100 dark:bg-white/[0.03]' : '',
  );

  protected handleToggle(): void {
    if (window.innerWidth >= 1280) {
      this.sidebarService.toggleExpanded();
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  protected toggleApplicationMenu(): void {
    this.isApplicationMenuOpen.update((v) => !v);
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput()?.nativeElement.focus();
    }
  };

  constructor() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}
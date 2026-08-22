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
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
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

const USER_MENU_ITEMS: HeaderUserMenuItem[] = [
  { to: '/profile', icon: IconUserCircleComponent, label: 'Editar perfil' },
  { to: '/profile', icon: IconSettingsComponent, label: 'Configuración de la cuenta' },
  { to: '/profile', icon: IconInfoCircleBorderComponent, label: 'Soporte' },
];

const SIGN_OUT_ITEM: HeaderUserMenuItem = {
  icon: IconLogoutComponent,
  label: 'Cerrar sesión',
};

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
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isMobileOpen = toSignal(this.sidebarService.isMobileOpen$, {
    initialValue: false,
  });

  protected readonly isApplicationMenuOpen = signal(false);

  protected readonly currentUser = computed<HeaderUserInfo>(() => {
    const usuario = this.auth.usuario();
    return {
      name: usuario?.nombreCompleto ?? 'Usuario',
      email: usuario?.email ?? '',
      avatar: '/images/user/owner.png',
    };
  });

  protected readonly notifications: HeaderNotificationItem[] = [];
  protected readonly userMenuItems = USER_MENU_ITEMS;
  protected readonly signOutItem = SIGN_OUT_ITEM;

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
    // `matchMedia` es más confiable que `window.innerWidth` para
    // detectar el breakpoint xl (1280px). Evita falsos negativos
    // cuando hay zoom no-100%, DevTools abierto a un lado, iframes,
    // o scrollbars que reducen el viewport efectivo.
    const isDesktop = window.matchMedia('(min-width: 1280px)').matches;
    if (isDesktop) {
      this.sidebarService.toggleExpanded();
      // Garantiza que el cambio sea visible de inmediato aunque haya
      // hover residual sobre el aside (e.g. el cursor quedó encima
      // mientras el usuario iba al botón del header).
      this.sidebarService.setHovered(false);
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  protected handleSignOut(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/signin');
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
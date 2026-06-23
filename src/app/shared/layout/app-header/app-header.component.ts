import { Component, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { SidebarService } from "../../services/sidebar.service";
import { CommonThemeToggleComponent } from "@shared/common/theme-toggle";
import {
  HeaderNotificationDropdownComponent,
  HeaderUserDropdownComponent,
  type HeaderNotificationItem,
  type HeaderUserInfo,
  type HeaderUserMenuItem,
} from "@shared/header";
import {
  IconInfoCircleBorderComponent,
  IconLogoutComponent,
  IconSettingsComponent,
  IconUserCircleComponent,
} from "@shared/icons";

const CURRENT_USER: HeaderUserInfo = {
  name: "Musharof Chowdhury",
  email: "randomuser@pimjo.com",
  avatar: "/images/user/owner.png",
};

const USER_MENU_ITEMS: HeaderUserMenuItem[] = [
  { to: "/profile", icon: IconUserCircleComponent, label: "Edit profile" },
  { to: "/profile", icon: IconSettingsComponent, label: "Account Settings" },
  { to: "/profile", icon: IconInfoCircleBorderComponent, label: "Support" },
];

const SIGN_OUT_ITEM: HeaderUserMenuItem = {
  to: "/signin",
  icon: IconLogoutComponent,
  label: "Sign out",
};

const NOTIFICATIONS: HeaderNotificationItem[] = [
  {
    actor: { name: "Terry Franci", avatar: "/images/user/user-02.jpg" },
    action: "requests permission to change",
    target: "Project - Nganter App",
    category: "Project",
    time: "5 min ago",
    status: "online",
  },
  {
    actor: { name: "Alena Franci", avatar: "/images/user/user-03.jpg" },
    action: "requests permission to change",
    target: "Project - Nganter App",
    category: "Project",
    time: "8 min ago",
    status: "online",
  },
  {
    actor: { name: "Jocelyn Kenter", avatar: "/images/user/user-04.jpg" },
    action: "requests permission to change",
    target: "Project - Nganter App",
    category: "Project",
    time: "15 min ago",
    status: "online",
  },
  {
    actor: { name: "Brandon Philips", avatar: "/images/user/user-05.jpg" },
    action: "requests permission to change",
    target: "Project - Nganter App",
    category: "Project",
    time: "1 hr ago",
    status: "offline",
    to: "/",
  },
  {
    actor: { name: "Terry Franci", avatar: "/images/user/user-02.jpg" },
    action: "requests permission to change",
    target: "Project - Nganter App",
    category: "Project",
    time: "5 min ago",
    status: "online",
  },
  {
    actor: { name: "Alena Franci", avatar: "/images/user/user-03.jpg" },
    action: "requests permission to change",
    target: "Project - Nganter App",
    category: "Project",
    time: "8 min ago",
    status: "online",
  },
  {
    actor: { name: "Jocelyn Kenter", avatar: "/images/user/user-04.jpg" },
    action: "requests permission to change",
    target: "Project - Nganter App",
    category: "Project",
    time: "15 min ago",
    status: "online",
  },
  {
    actor: { name: "Brandon Philips", avatar: "/images/user/user-05.jpg" },
    action: "requests permission to change",
    target: "Project - Nganter App",
    category: "Project",
    time: "1 hr ago",
    status: "offline",
  },
];

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CommonThemeToggleComponent,
    HeaderNotificationDropdownComponent,
    HeaderUserDropdownComponent,
  ],
  templateUrl: "./app-header.component.html",
})
export class AppHeaderComponent {
  isApplicationMenuOpen = false;
  readonly isMobileOpen$;

  protected readonly currentUser = CURRENT_USER;
  protected readonly userMenuItems = USER_MENU_ITEMS;
  protected readonly signOutItem = SIGN_OUT_ITEM;
  protected readonly notifications = NOTIFICATIONS;

  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;

  constructor(public sidebarService: SidebarService) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  handleToggle() {
    if (window.innerWidth >= 1280) {
      this.sidebarService.toggleExpanded();
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  toggleApplicationMenu() {
    this.isApplicationMenuOpen = !this.isApplicationMenuOpen;
  }

  ngAfterViewInit() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  ngOnDestroy() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
    }
  };
}

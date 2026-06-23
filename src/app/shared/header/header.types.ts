import type { Type } from "@angular/core";
import type { AvatarStatus } from "@shared/ui/avatar";

export interface HeaderUserInfo {
  name: string;
  email: string;
  avatar: string;
}

export interface HeaderUserMenuItem {
  to?: string;
  icon: Type<unknown>;
  label: string;
}

export interface HeaderNotificationActor {
  name: string;
  avatar: string;
}

export type HeaderNotificationStatus = Exclude<AvatarStatus, "none">;

export interface HeaderNotificationItem {
  actor: HeaderNotificationActor;
  action: string;
  target: string;
  category: string;
  time: string;
  status: HeaderNotificationStatus;
  to?: string;
}

export interface HeaderNotificationViewAll {
  to: string;
  label: string;
}
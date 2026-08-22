import type { Type } from "@angular/core";

export interface SidebarSubItem {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
}

export interface NavItem {
  name: string;
  iconKey: string | null;
  path?: string;
  new?: boolean;
  subItems?: SidebarSubItem[];
}

export type { Type };
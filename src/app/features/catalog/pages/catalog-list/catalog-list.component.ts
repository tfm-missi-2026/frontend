import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";

import {
  IconDotsVerticalComponent,
  IconPlusSimpleComponent,
} from "@shared/icons";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiCardComponent } from "@shared/ui/card";
import { UiDropdownComponent } from "@shared/ui/dropdown";
import { UiDropdownItemComponent } from "@shared/ui/dropdown";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiIconButtonComponent } from "@shared/ui/icon-button";
import { UiLabelComponent } from "@shared/ui/label";

import { ItemFormModalComponent } from "../../components/item-form-modal/item-form-modal.component";
import type { ItemFormSavePayload } from "../../components/item-form-modal/item-form-modal.component";
import { CatalogToolbarComponent } from "../../components/catalog-toolbar/catalog-toolbar.component";
import {
  CATALOG_GROUPS,
  findGroup,
  type CatalogGroupCode,
  type CatalogItem,
} from "../../models/catalog-item";
import { CatalogMockService } from "../../services/catalog-mock.service";

@Component({
  selector: "CatalogListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    ItemFormModalComponent,
    CatalogToolbarComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
    UiDropdownComponent,
    UiDropdownItemComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiIconButtonComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./catalog-list.component.html",
  styles: [
    `
      .group-item {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 10px 12px;
        cursor: pointer;
        border-radius: 12px;
        border: 1px solid transparent;
        background: transparent;
        transition:
          background-color 120ms ease,
          border-color 120ms ease;
        text-align: left;
      }
      .group-item:hover {
        background-color: rgb(249 250 251);
      }
      :host-context(.dark) .group-item:hover {
        background-color: rgb(255 255 255 / 0.03);
      }
      .group-item-selected {
        background-color: rgb(249 250 251);
        border-color: rgb(229 231 235);
        box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
      }
      :host-context(.dark) .group-item-selected {
        background-color: rgb(255 255 255 / 0.04);
        border-color: rgb(55 65 81);
      }
    `,
  ],
})
export class CatalogListComponent {
  private readonly catalogService = inject(CatalogMockService);

  protected readonly groups = CATALOG_GROUPS;

  protected readonly plusIcon = IconPlusSimpleComponent;
  protected readonly dotsIcon = IconDotsVerticalComponent;

  protected readonly breadcrumbItems = [
    { label: "Administración", route: "/app/administracion" },
    { label: "Catálogo" },
  ];

  protected readonly selectedGroup = signal<CatalogGroupCode>("TACT");
  protected readonly searchTerm = signal<string>("");

  protected readonly items = this.catalogService.items;

  protected readonly currentGroup = computed(() => findGroup(this.selectedGroup()));

  protected readonly itemsInGroup = computed<CatalogItem[]>(() => {
    const code = this.selectedGroup();
    return this.items()
      .filter((i) => i.groupCode === code)
      .sort((a, b) => a.order - b.order);
  });

  protected readonly filteredItems = computed<CatalogItem[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.itemsInGroup();
    return this.itemsInGroup().filter(
      (i) =>
        i.code.toLowerCase().includes(term) ||
        i.name.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term),
    );
  });

  protected readonly activeCount = computed<number>(
    () => this.itemsInGroup().filter((i) => i.status === "Activo").length,
  );

  protected readonly formOpen = signal<boolean>(false);
  protected readonly formMode = signal<"create" | "edit">("create");
  protected readonly selectedItem = signal<CatalogItem | null>(null);

  protected readonly openActionsId = signal<string | null>(null);

  protected countByGroup(code: CatalogGroupCode): number {
    return this.items().filter((i) => i.groupCode === code).length;
  }

  protected selectGroup(code: CatalogGroupCode): void {
    this.selectedGroup.set(code);
    this.searchTerm.set("");
    this.closeActions();
  }

  protected openCreate(): void {
    this.formMode.set("create");
    this.selectedItem.set(null);
    this.formOpen.set(true);
  }

  protected openEdit(item: CatalogItem): void {
    this.formMode.set("edit");
    this.selectedItem.set(item);
    this.formOpen.set(true);
    this.closeActions();
  }

  protected closeForm(): void {
    this.formOpen.set(false);
  }

  protected toggleActions(id: string): void {
    this.openActionsId.update((curr) => (curr === id ? null : id));
  }

  protected closeActions(): void {
    this.openActionsId.set(null);
  }

  protected onEditFromMenu(item: CatalogItem): void {
    this.openEdit(item);
  }

  protected onDeactivate(item: CatalogItem): void {
    this.catalogService.deactivate(item.id);
    this.closeActions();
  }

  protected onSaveItem(payload: ItemFormSavePayload): void {
    if (payload.mode === "create") {
      this.catalogService.create(payload.data);
      this.selectedGroup.set(payload.data.groupCode);
    } else {
      this.catalogService.update(payload.id, payload.data);
    }
    this.formOpen.set(false);
  }

  protected onNewGroup(): void {
    // Pendiente: alta de grupos paramétricos.
  }
}
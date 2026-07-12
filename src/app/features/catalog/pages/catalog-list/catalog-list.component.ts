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
  template: `
    <UiFlex direction="column" [gap]="16">
      <CommonBreadcrumb [items]="breadcrumbItems" />

      <UiFlex
        direction="row"
        alignItems="center"
        justifyContent="between"
        [gap]="12"
        className="flex-wrap"
      >
        <UiFlex direction="column" [gap]="2">
          <UiHeader [level]="1" text="Catálogo" />
          <UiLabel type="bodyS" color="textWeak">
            Tabla paramétrica unificada. Cada grupo alimenta los desplegables
            del sistema (formularios de proyectos, variaciones, etc.).
          </UiLabel>
        </UiFlex>
        <UiButton
          variant="primary"
          [LeftIcon]="plusIcon"
          labelText="Nuevo ítem"
          (click)="openCreate()"
        />
      </UiFlex>

      <UiFlex className="grid gap-4 lg:grid-cols-[300px_1fr]" alignItems="start">
        <UiFlex direction="column" [gap]="8">
          <UiLabel
            type="bodyXs"
            color="textStrong"
            weight="semibold"
            className="uppercase"
          >
            Grupos del catálogo
          </UiLabel>
          @for (g of groups; track g.code) {
            <button
              type="button"
              class="group-item"
              [class.group-item-selected]="g.code === selectedGroup()"
              (click)="selectGroup(g.code)"
            >
              <UiBadge
                [variant]="g.code === selectedGroup() ? 'solid' : 'light'"
                color="dark"
                size="sm"
              >
                {{ g.code }}
              </UiBadge>
              <UiFlex direction="column" [gap]="2" className="flex-1 min-w-0">
                <UiLabel
                  type="bodyS"
                  weight="semibold"
                  color="textStrong"
                  [text]="g.name"
                />
                <UiLabel type="bodyXs" color="textWeak">
                  {{ countByGroup(g.code) }} ítems
                </UiLabel>
              </UiFlex>
              @if (g.code === selectedGroup()) {
                <span class="text-gray-500 dark:text-gray-400">▸</span>
              }
            </button>
          }
          <UiButton
            variant="secondary"
            [compact]="true"
            [fullWidth]="true"
            labelText="+ Nuevo grupo"
            className="border-dashed"
            (click)="onNewGroup()"
          />
        </UiFlex>

        <UiCard padding="lg" className="overflow-hidden">
          <UiFlex
            direction="row"
            alignItems="end"
            justifyContent="between"
            [gap]="12"
            className="mb-4 flex-wrap"
          >
            <UiFlex direction="column" [gap]="2">
              <UiHeader [level]="3" [text]="currentGroup().name" />
              <UiLabel type="bodyXs" color="textWeak">
                Grupo {{ currentGroup().code }} · {{ currentGroup().description }}
              </UiLabel>
            </UiFlex>
            <UiBadge variant="light" color="dark" size="md">
              {{ currentGroup().code }}
            </UiBadge>
          </UiFlex>

          <CatalogToolbar
            [searchTerm]="searchTerm()"
            (searchChange)="searchTerm.set($event)"
          />

          <div class="-mx-6 mt-4 overflow-x-auto px-6">
            <table class="w-full text-left text-sm text-gray-700 dark:text-gray-300">
              <thead
                class="border-y border-gray-100 text-xs uppercase tracking-wide text-gray-500 dark:border-white/5 dark:text-gray-400"
              >
                <tr>
                  <th class="px-3 py-3 font-medium">Código</th>
                  <th class="px-3 py-3 font-medium">Nombre</th>
                  <th class="px-3 py-3 font-medium">Descripción</th>
                  <th class="px-3 py-3 text-center font-medium">Orden</th>
                  <th class="px-3 py-3 font-medium">Estado</th>
                  <th class="px-3 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                @for (item of filteredItems(); track item.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-white/3">
                    <td class="px-3 py-3.5 font-mono text-xs text-gray-600 dark:text-gray-400">
                      {{ item.code }}
                    </td>
                    <td class="px-3 py-3.5">
                      <UiLabel type="bodyS" weight="semibold" color="textStrong">
                        {{ item.name }}
                      </UiLabel>
                    </td>
                    <td class="px-3 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                      {{ item.description }}
                    </td>
                    <td class="px-3 py-3.5 text-center">
                      <span
                        class="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300"
                      >
                        {{ item.order }}
                      </span>
                    </td>
                    <td class="px-3 py-3.5">
                      @if (item.status === "Activo") {
                        <UiBadge variant="light" color="success" size="sm">
                          <span class="mr-1">●</span> Activo
                        </UiBadge>
                      } @else {
                        <UiBadge variant="light" color="error" size="sm">
                          <span class="mr-1">○</span> Inactivo
                        </UiBadge>
                      }
                    </td>
                    <td class="px-3 py-3.5">
                      <UiFlex
                        direction="row"
                        alignItems="center"
                        justifyContent="end"
                        [gap]="6"
                      >
                        <UiButton
                          variant="tertiary"
                          [compact]="true"
                          labelText="Editar"
                          (click)="openEdit(item)"
                        />
                        <UiButton
                          variant="tertiary"
                          [compact]="true"
                          labelText="Dar de baja"
                          [disabled]="item.status === 'Inactivo'"
                          (click)="onDeactivate(item)"
                        />
                        <div class="relative">
                          <UiIconButton
                            [Icon]="dotsIcon"
                            variant="tertiary"
                            [compact]="true"
                            tooltip="Más acciones"
                            tooltipSide="top"
                            labelText="Más acciones"
                            (click)="toggleActions(item.id)"
                          />
                          <UiDropdown
                            [isOpen]="openActionsId() === item.id"
                            align="right"
                            (close)="closeActions()"
                          >
                            <UiDropdownItem (itemClick)="onEditFromMenu(item)">
                              Editar
                            </UiDropdownItem>
                            <UiDropdownItem
                              (itemClick)="onDeactivate(item)"
                              [disabled]="item.status === 'Inactivo'"
                            >
                              Dar de baja
                            </UiDropdownItem>
                          </UiDropdown>
                        </div>
                      </UiFlex>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="px-3 py-10 text-center">
                      <UiLabel type="bodyS" color="textWeak">
                        Sin ítems para los filtros aplicados.
                      </UiLabel>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <UiFlex
            direction="row"
            alignItems="center"
            justifyContent="between"
            [gap]="8"
            className="mt-4 border-t border-dashed border-gray-200 pt-3 dark:border-gray-800"
          >
            <UiLabel type="bodyXs" color="textWeak">
              {{ filteredItems().length }} ítems ·
              {{ activeCount() }} activos
            </UiLabel>
            <UiLabel type="bodyXs" color="textWeak">
              Arrastra las filas para reordenar · el Orden define la posición
              en el desplegable.
            </UiLabel>
          </UiFlex>
        </UiCard>
      </UiFlex>
    </UiFlex>

    <ItemFormModal
      [isOpen]="formOpen()"
      [mode]="formMode()"
      [item]="selectedItem()"
      (save)="onSaveItem($event)"
      (close)="closeForm()"
    />
  `,
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
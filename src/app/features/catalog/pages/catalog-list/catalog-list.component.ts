import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { CatalogoQueryParams } from "@core/query-params";
import {
  IconEditPencilComponent,
  IconPlusSimpleComponent,
  IconTrashComponent,
} from "@shared/icons";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiCardComponent } from "@shared/ui/card";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiIconButtonComponent } from "@shared/ui/icon-button";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";
import {
  UiTableComponent,
  TableColumn,
  type TableCellContext,
} from "@shared/ui/table";

import { ItemFormModalComponent } from "../../components/item-form-modal/item-form-modal.component";
import type { ItemFormSavePayload } from "../../components/item-form-modal/item-form-modal.component";
import {
  CATALOG_GROUPS,
  findGroup,
  type CatalogGroupCode,
  type CatalogItem,
} from "../../models/catalog-item";
import { CatalogoAdminService } from "../../services/catalog-admin.service";
import { CatalogService } from "../../services/catalog.service";

@Component({
  selector: "CatalogListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    FormsModule,
    ItemFormModalComponent,
    UiAlertComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiIconButtonComponent,
    UiLabelComponent,
    UiSelectComponent,
    UiTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./catalog-list.component.html",
})
export class CatalogListComponent implements OnInit {
  private readonly admin = inject(CatalogoAdminService);
  private readonly catalogService = inject(CatalogService);

  ngOnInit(): void {
    void this.catalogService.cargar();
    this.admin.filterByGrupo(this.selectedGroup());
  }

  protected readonly groups = CATALOG_GROUPS;

  protected readonly plusIcon = IconPlusSimpleComponent;
  protected readonly editIcon = IconEditPencilComponent;
  protected readonly trashIcon = IconTrashComponent;

  protected readonly breadcrumbItems = [
    { label: "Administración", route: "/app/administracion" },
    { label: "Catálogo" },
  ];

  protected readonly selectedGroup = signal<CatalogGroupCode>("TACT");
  protected readonly estadoFiltro = signal<"todos" | "Activo" | "Inactivo">(
    "todos",
  );

  protected readonly estadoFiltroOpciones: SelectOption[] = [
    { value: "todos", label: "Todos" },
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
  ];

  // ----- Servicio server-side (UiTable en modo auto) -----
  protected readonly query = this.admin.query;
  protected readonly error = this.admin.error;

  protected readonly fetchCatalogo = (
    q: Parameters<CatalogoAdminService["fetchData"]>[0],
  ) => this.admin.fetchData(q);

  protected readonly currentGroup = computed(() =>
    findGroup(this.selectedGroup()),
  );

  protected readonly pageSizeOptions: number[] = [10, 20, 50];

  protected readonly groupCount = computed<number>(
    () =>
      this.catalogService
        .items()
        .filter((i) => i.groupCode === this.selectedGroup()).length,
  );

  protected readonly activeCount = computed<number>(
    () =>
      this.catalogService
        .items()
        .filter(
          (i) =>
            i.groupCode === this.selectedGroup() && i.status === "Activo",
        ).length,
  );

  protected readonly formOpen = signal<boolean>(false);
  protected readonly formMode = signal<"create" | "edit">("create");
  protected readonly selectedItem = signal<CatalogItem | null>(null);

  @ViewChild("estadoCell", { static: true })
  private estadoCell!: TemplateRef<TableCellContext<CatalogItem>>;
  @ViewChild("accionesCell", { static: true })
  private accionesCell!: TemplateRef<TableCellContext<CatalogItem>>;

  protected readonly tableColumns = computed<TableColumn<CatalogItem>[]>(() => [
    {
      key: "code",
      header: "Código",
      width: "120px",
      searchable: false,
      sortable: true,
      sortKey: "code",
    },
    {
      key: "name",
      header: "Nombre",
      searchable: false,
      sortable: true,
      sortKey: "name",
    },
    { key: "description", header: "Descripción", searchable: false },
    {
      key: "order",
      header: "Orden",
      align: "center",
      width: "90px",
      searchable: false,
      sortable: true,
      sortKey: "order",
    },
    {
      key: "estado",
      header: "Estado",
      align: "center",
      width: "120px",
      searchable: false,
      sortable: true,
      sortKey: "status",
      cell: this.estadoCell,
    },
    {
      key: "acciones",
      header: "Acciones",
      align: "end",
      width: "160px",
      searchable: false,
      cell: this.accionesCell,
    },
  ]);

  protected countByGroup(code: CatalogGroupCode): number {
    return this.catalogService
      .items()
      .filter((i) => i.groupCode === code).length;
  }

  protected selectGroup(code: CatalogGroupCode): void {
    this.selectedGroup.set(code);
    this.admin.filterByGrupo(code);
  }

  protected onQueryChange(q: CatalogoQueryParams): void {
    this.admin.query.set(q);
  }

  protected onEstadoFiltroChange(value: unknown): void {
    const v = value == null ? "todos" : String(value);
    this.estadoFiltro.set(v as "todos" | "Activo" | "Inactivo");
    this.admin.filterByEstado(
      v === "Activo" ? 1 : v === "Inactivo" ? 0 : null,
    );
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
  }

  protected closeForm(): void {
    this.formOpen.set(false);
  }

  protected onDeactivate(item: CatalogItem): void {
    void this.admin.deactivate(item.id);
  }

  protected async onSaveItem(payload: ItemFormSavePayload): Promise<void> {
    if (payload.mode === "create") {
      const created = await this.admin.create(payload.data);
      if (created) {
        this.selectedGroup.set(payload.data.groupCode);
        this.admin.filterByGrupo(payload.data.groupCode);
        this.formOpen.set(false);
      }
    } else {
      const updated = await this.admin.update(payload.id, payload.data);
      if (updated) {
        this.formOpen.set(false);
      }
    }
  }

  protected onNewGroup(): void {
    // Pendiente: alta de grupos paramétricos.
  }
}

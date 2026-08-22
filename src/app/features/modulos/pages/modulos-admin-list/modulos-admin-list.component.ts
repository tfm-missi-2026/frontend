import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { LookupsService } from "@core/lookups/lookups.service";
import { ModuloQueryParams } from "@core/query-params";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import {
  IconEditPencilComponent,
  IconPlusSimpleComponent,
} from "@shared/icons";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";
import {
  UiTableComponent,
  TableColumn,
  TablePageEvent,
  type TableCellContext,
} from "@shared/ui/table";

import { ModuloDisableModalComponent } from "../../components/modulo-disable-modal/modulo-disable-modal.component";
import { ModuloFormModalComponent } from "../../components/modulo-form-modal/modulo-form-modal.component";
import type { ModuloFormData } from "../../components/modulo-form-modal/modulo-form-modal.component";
import type { ModuloResponse } from "@core/modulos/modulo.models";

import { ModulosAdminService } from "../../services/modulos-admin.service";

const SECCIONES_FILTRO: SelectOption[] = [
  { value: "", label: "Todas las secciones" },
  { value: "OPERACION", label: "Operacion" },
  { value: "SEGUIMIENTO", label: "Seguimiento" },
  { value: "ADMINISTRACION", label: "Administracion" },
  { value: "CUENTA", label: "Mi cuenta" },
];

const ESTADO_FILTRO: SelectOption[] = [
  { value: "1", label: "Habilitados" },
  { value: "0", label: "Deshabilitados" },
];

@Component({
  selector: "ModulosAdminListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    FormsModule,
    ModuloDisableModalComponent,
    ModuloFormModalComponent,
    UiAlertComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSelectComponent,
    UiTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./modulos-admin-list.component.html",
})
export class ModulosAdminListComponent implements OnInit {
  private readonly service = inject(ModulosAdminService);
  private readonly lookups = inject(LookupsService);

  protected readonly plusIcon = IconPlusSimpleComponent;
  protected readonly editIcon = IconEditPencilComponent;

  protected readonly breadcrumbItems = [
    { label: "Administracion" },
    { label: "Modulos" },
  ];

  protected readonly loading = this.service.loading;
  protected readonly error = this.service.error;
  protected readonly page = this.service.page;
  protected readonly modulos = computed<ModuloResponse[]>(() => this.page()?.items ?? []);
  protected readonly secciones = this.lookups.secciones;

  protected readonly currentQuery = signal<ModuloQueryParams>(
    new ModuloQueryParams({ pageSize: 20 }),
  );

  protected readonly seccionesFiltro = SECCIONES_FILTRO;
  protected readonly estadoFiltro = ESTADO_FILTRO;

  protected readonly createOpen = signal<boolean>(false);
  protected readonly editTarget = signal<ModuloResponse | null>(null);
  protected readonly disableTarget = signal<ModuloResponse | null>(null);
  protected readonly successAlert = signal<string | null>(null);

  protected readonly seccionFiltroActual = signal<string>("");
  protected readonly estadoFiltroActual = signal<string>("1");

  protected readonly tableColumns = computed<TableColumn<ModuloResponse>[]>(() => [
    { key: "codigo", header: "Codigo", width: "140px" },
    { key: "nombre", header: "Nombre" },
    { key: "seccion", header: "Seccion", width: "160px" },
    {
      key: "estado",
      header: "Estado",
      width: "180px",
      align: "center",
      cell: this.estadoCell,
    },
    {
      key: "acciones",
      header: "Acciones",
      width: "200px",
      align: "end",
      cell: this.accionesCell,
    },
  ]);

  @ViewChild("estadoCell", { static: true })
  private estadoCell!: TemplateRef<TableCellContext<ModuloResponse>>;
  @ViewChild("accionesCell", { static: true })
  private accionesCell!: TemplateRef<TableCellContext<ModuloResponse>>;

  ngOnInit(): void {
    void this.bootstrap();
  }

  private async bootstrap(): Promise<void> {
    await this.service.load(this.currentQuery());
  }

  protected onPageChange(event: TablePageEvent): void {
    void this.service.load({
      page: event.page,
      pageSize: event.pageSize,
    });
  }

  protected onSearchChange(term: string): void {
    void this.service.load({ search: term, page: 1 });
  }

  protected onSeccionFiltroChange(value: unknown): void {
    const v = value == null ? "" : String(value);
    this.seccionFiltroActual.set(v);
    void this.service.load({
      seccion: v ? v : null,
      page: 1,
    });
  }

  protected onEstadoFiltroChange(value: unknown): void {
    const v = value == null ? "" : String(value);
    this.estadoFiltroActual.set(v);
    void this.service.load({
      estado: v === "" ? null : (Number(v) as 0 | 1),
      page: 1,
    });
  }

  protected onCreate(): void {
    this.createOpen.set(true);
  }

  protected onCloseCreate(): void {
    this.createOpen.set(false);
  }

  protected async onSave(
    payload:
      | { data: ModuloFormData }
      | { id: string; data: ModuloFormData },
  ): Promise<void> {
    if ("id" in payload) {
      await this.onSaveEditInternal(payload);
    } else {
      await this.onSaveCreateInternal(payload);
    }
  }

  private async onSaveCreateInternal(payload: {
    data: ModuloFormData;
  }): Promise<void> {
    const creado = await this.service.create({
      codigo: payload.data.codigo.trim().toUpperCase(),
      nombre: payload.data.nombre.trim(),
      icono: payload.data.icono?.trim() || undefined,
      orden: payload.data.orden,
      seccion: payload.data.seccion.trim().toUpperCase(),
      tipo: payload.data.tipo,
      descripcion: payload.data.descripcion.trim() || undefined,
    });
    if (creado) {
      this.createOpen.set(false);
      this.successAlert.set(`Modulo "${creado.nombre}" creado.`);
      await this.service.load(this.currentQuery());
    }
  }

  private async onSaveEditInternal(payload: {
    id: string;
    data: ModuloFormData;
  }): Promise<void> {
    const actualizado = await this.service.update(payload.id, {
      nombre: payload.data.nombre.trim(),
      icono: payload.data.icono?.trim() || undefined,
      orden: payload.data.orden,
      seccion: payload.data.seccion.trim().toUpperCase(),
      tipo: payload.data.tipo,
      descripcion: payload.data.descripcion.trim() || undefined,
    });
    if (actualizado) {
      this.editTarget.set(null);
      this.successAlert.set(`Modulo "${actualizado.nombre}" actualizado.`);
      await this.service.load(this.currentQuery());
    }
  }

  protected onEdit(m: ModuloResponse): void {
    if (m.sistema) return;
    this.editTarget.set(m);
  }

  protected onRequestDisable(m: ModuloResponse): void {
    if (m.sistema || m.estado === 0) return;
    this.disableTarget.set(m);
  }

  protected onRequestEnable(m: ModuloResponse): void {
    if (m.sistema || m.estado !== 0) return;
    void this.onToggleEstado(m, { motivoEliminacion: "" });
  }

  protected onConfirmDisable(payload: {
    motivoEliminacion: string;
  }): void {
    const m = this.disableTarget();
    if (!m) return;
    void this.onToggleEstado(m, payload);
  }

  protected async onToggleEstado(
    m: ModuloResponse,
    payload: { motivoEliminacion: string },
  ): Promise<void> {
    if (m.sistema) return;
    const nuevoEstado = m.estado === 0 ? 1 : 0;
    const actualizado = await this.service.changeState(m.id, {
      estado: nuevoEstado as 0 | 1,
      motivoEliminacion:
        nuevoEstado === 0 ? payload.motivoEliminacion.trim() : undefined,
    });
    if (actualizado) {
      this.disableTarget.set(null);
      const accion = nuevoEstado === 0 ? "deshabilitar" : "habilitar";
      this.successAlert.set(
        `Modulo "${actualizado.nombre}" ${accion}do.`,
      );
      await this.service.load(this.currentQuery());
    }
  }

  protected onDismissAlert(): void {
    this.successAlert.set(null);
  }
}
import { Injectable, computed, signal } from "@angular/core";

import type {
  CatalogGroupCode,
  CatalogItem,
  CatalogItemFormData,
} from "../models/catalog-item";

const INITIAL: CatalogItem[] = [
  {
    id: "tact-reu",
    groupCode: "TACT",
    code: "REU",
    name: "Reunión",
    description: "Coordinación o seguimiento con el equipo.",
    order: 1,
    status: "Activo",
  },
  {
    id: "tact-cap",
    groupCode: "TACT",
    code: "CAP",
    name: "Capacitación",
    description: "Formación interna o externa.",
    order: 2,
    status: "Activo",
  },
  {
    id: "tact-sop",
    groupCode: "TACT",
    code: "SOP",
    name: "Soporte",
    description: "Atención de incidencias y soporte técnico.",
    order: 3,
    status: "Activo",
  },
  {
    id: "tact-otr",
    groupCode: "TACT",
    code: "OTR",
    name: "Otro",
    description: "Actividad no clasificada.",
    order: 4,
    status: "Inactivo",
  },
  {
    id: "mod-pre",
    groupCode: "MOD",
    code: "PRE",
    name: "Presencial",
    description: "Actividad realizada en sede.",
    order: 1,
    status: "Activo",
  },
  {
    id: "mod-vir",
    groupCode: "MOD",
    code: "VIR",
    name: "Virtual",
    description: "Actividad realizada de forma remota.",
    order: 2,
    status: "Activo",
  },
  {
    id: "mod-hib",
    groupCode: "MOD",
    code: "HIB",
    name: "Híbrida",
    description: "Combinación presencial y virtual.",
    order: 3,
    status: "Activo",
  },
  {
    id: "tvar-alc",
    groupCode: "TVAR",
    code: "ALC",
    name: "Alcance",
    description: "Cambio en el alcance del subproyecto.",
    order: 1,
    status: "Activo",
  },
  {
    id: "tvar-plz",
    groupCode: "TVAR",
    code: "PLZ",
    name: "Plazo",
    description: "Cambio en fechas o cronograma.",
    order: 2,
    status: "Activo",
  },
  {
    id: "tvar-rec",
    groupCode: "TVAR",
    code: "REC",
    name: "Recursos",
    description: "Cambio en recursos asignados.",
    order: 3,
    status: "Activo",
  },
  {
    id: "svar-pen",
    groupCode: "SVAR",
    code: "PEN",
    name: "Pendiente",
    description: "Variación registrada, a la espera de decisión.",
    order: 1,
    status: "Activo",
  },
  {
    id: "svar-apr",
    groupCode: "SVAR",
    code: "APR",
    name: "Aprobada",
    description: "Aceptada y aplicada al plan.",
    order: 2,
    status: "Activo",
  },
  {
    id: "svar-rec",
    groupCode: "SVAR",
    code: "REC",
    name: "Rechazada",
    description: "No procede.",
    order: 3,
    status: "Inactivo",
  },
  {
    id: "tsub-inc",
    groupCode: "TSUB",
    code: "INC",
    name: "Incidencia",
    description: "Falla o error a corregir sobre el sistema.",
    order: 1,
    status: "Activo",
  },
  {
    id: "tsub-req",
    groupCode: "TSUB",
    code: "REQ",
    name: "Requerimiento",
    description: "Nueva necesidad funcional solicitada.",
    order: 2,
    status: "Activo",
  },
  {
    id: "tsub-dmo",
    groupCode: "TSUB",
    code: "DMO",
    name: "Desarrollo modular",
    description: "Construcción de un módulo nuevo.",
    order: 3,
    status: "Activo",
  },
  {
    id: "prio-alt",
    groupCode: "PRIO",
    code: "ALT",
    name: "Alta",
    description: "Atención urgente.",
    order: 1,
    status: "Activo",
  },
  {
    id: "prio-med",
    groupCode: "PRIO",
    code: "MED",
    name: "Media",
    description: "Atención en plazo normal.",
    order: 2,
    status: "Activo",
  },
  {
    id: "prio-baj",
    groupCode: "PRIO",
    code: "BAJ",
    name: "Baja",
    description: "Puede esperar.",
    order: 3,
    status: "Activo",
  },
  {
    id: "sit-cul",
    groupCode: "SIT",
    code: "CUL",
    name: "Culminado",
    description: "Trabajo terminado.",
    order: 4,
    status: "Inactivo",
  },
];

@Injectable({ providedIn: "root" })
export class CatalogMockService {
  private readonly _items = signal<CatalogItem[]>(INITIAL);
  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().length);

  byGroup(code: CatalogGroupCode): CatalogItem[] {
    return this._items()
      .filter((i) => i.groupCode === code)
      .sort((a, b) => a.order - b.order);
  }

  create(data: CatalogItemFormData): CatalogItem {
    const next: CatalogItem = {
      ...data,
      id: `item-${Date.now()}`,
    };
    this._items.update((arr) => [next, ...arr]);
    return next;
  }

  update(id: string, patch: Partial<CatalogItemFormData>): void {
    this._items.update((arr) =>
      arr.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    );
  }

  deactivate(id: string): void {
    this.update(id, { status: "Inactivo" });
  }
}
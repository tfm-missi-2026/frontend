import type {
  CatalogoApi,
  CatalogoCrearApi,
} from "../models/catalog-api";
import type {
  CatalogGroupCode,
  CatalogItem,
  CatalogItemFormData,
  CatalogItemStatus,
} from "../models/catalog-item";

// Mapeos puros sin DI. Backend grupo (TIPO_ACTIVIDAD) <-> UI short code (TACT).
const GRUPO_BACKEND_TO_UI: Record<string, CatalogGroupCode> = {
  TIPO_ACTIVIDAD: "TACT",
  MODALIDAD: "MOD",
  TIPO_VARIACION: "TVAR",
  SITUACION_VARIACION: "SVAR",
  TIPO_SUBPROYECTO: "TSUB",
  PRIORIDAD: "PRIO",
  SITUACION: "SIT",
};

const GRUPO_UI_TO_BACKEND: Record<CatalogGroupCode, string> = {
  TACT: "TIPO_ACTIVIDAD",
  MOD: "MODALIDAD",
  TVAR: "TIPO_VARIACION",
  SVAR: "SITUACION_VARIACION",
  TSUB: "TIPO_SUBPROYECTO",
  PRIO: "PRIORIDAD",
  SIT: "SITUACION",
};

export function grupoBackendToUi(grupo: string): CatalogGroupCode | null {
  return GRUPO_BACKEND_TO_UI[grupo] ?? null;
}

export function grupoUiToBackend(code: CatalogGroupCode): string {
  return GRUPO_UI_TO_BACKEND[code];
}

export function estadoToStatus(estado: number): CatalogItemStatus {
  return estado === 1 ? "Activo" : "Inactivo";
}

export function statusToEstado(status: CatalogItemStatus): 0 | 1 {
  return status === "Activo" ? 1 : 0;
}

export function catalogoApiToItem(api: CatalogoApi): CatalogItem | null {
  const groupCode = grupoBackendToUi(api.grupo);
  if (!groupCode) return null;
  return {
    id: api.id,
    groupCode,
    code: String(api.idOpcion),
    name: api.opcion,
    description: "",
    order: api.idOpcion,
    status: estadoToStatus(api.estado),
  };
}

export function formDataToCrearApi(
  data: CatalogItemFormData,
): CatalogoCrearApi {
  return {
    grupo: grupoUiToBackend(data.groupCode),
    idOpcion: data.order,
    opcion: data.name,
  };
}

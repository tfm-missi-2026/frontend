import type { SelectOption } from "@shared/ui/select/select.types";

export type CatalogGroupCode =
  | "TACT"
  | "MOD"
  | "TVAR"
  | "SVAR"
  | "TSUB"
  | "PRIO"
  | "SIT";

export type CatalogItemStatus = "Activo" | "Inactivo";

export interface CatalogItem {
  id: string;
  groupCode: CatalogGroupCode;
  code: string;
  name: string;
  description: string;
  order: number;
  status: CatalogItemStatus;
}

export interface CatalogGroup {
  code: CatalogGroupCode;
  name: string;
  description: string;
}

export const CATALOG_GROUPS: CatalogGroup[] = [
  {
    code: "TACT",
    name: "Tipo de actividad",
    description: "alimenta “Actividad” en Seguimiento",
  },
  {
    code: "MOD",
    name: "Modalidad",
    description: "alimenta la modalidad de actividad en Seguimiento",
  },
  {
    code: "TVAR",
    name: "Tipo de variación",
    description: "alimenta “Tipo” en Variaciones",
  },
  {
    code: "SVAR",
    name: "Situación de variación",
    description: "alimenta “Situación” en Variaciones",
  },
  {
    code: "TSUB",
    name: "Tipo de subproyecto",
    description: "alimenta “Tipo” en Subproyectos",
  },
  {
    code: "PRIO",
    name: "Prioridad",
    description: "alimenta “Prioridad” en Subproyectos",
  },
  {
    code: "SIT",
    name: "Situación",
    description: "situación derivada de subproyectos y tareas",
  },
];

export const CATALOG_GROUP_OPTIONS: SelectOption[] = CATALOG_GROUPS.map(
  (g) => ({ value: g.code, label: `${g.code} — ${g.name}` }),
);

export const CATALOG_ITEM_STATUS_LABELS: Record<CatalogItemStatus, string> = {
  Activo: "Activo",
  Inactivo: "Inactivo",
};

export function findGroup(code: CatalogGroupCode): CatalogGroup {
  return CATALOG_GROUPS.find((g) => g.code === code) ?? CATALOG_GROUPS[0];
}

export interface CatalogItemFormData {
  groupCode: CatalogGroupCode;
  code: string;
  name: string;
  description: string;
  order: number;
  status: CatalogItemStatus;
}

export function emptyCatalogItemForm(): CatalogItemFormData {
  return {
    groupCode: "TACT",
    code: "",
    name: "",
    description: "",
    order: 1,
    status: "Activo",
  };
}
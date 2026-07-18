import type { SelectOption } from "@shared/ui/select";

export type VariationStatus = "Pendiente" | "Aprobada" | "Rechazada";

export type VariationType = "Alcance" | "Plazo" | "Recursos";

export type VariationTarget =
  | {
      kind: "task";
      taskId: string;
      label: string;
      ref: string | null;
    }
  | {
      kind: "subproject";
      subprojectId: string;
      label: string;
      ref: string | null;
    };

export interface VariationResolution {
  decision: Exclude<VariationStatus, "Pendiente">;
  observation: string;
  resolvedBy: string;
  resolvedAt: string;
}

export interface Variation {
  id: string;
  projectId: string | null;
  target: VariationTarget | null;
  type: VariationType;
  description: string;
  justification: string;
  previousValue: string;
  newValue: string;
  detectionDate: string;
  reportedBy: string;
  status: VariationStatus;
  resolution: VariationResolution | null;
}

export const VARIATION_TYPE_LABELS: Record<VariationType, string> = {
  Alcance: "Alcance",
  Plazo: "Plazo",
  Recursos: "Recursos",
};

export const VARIATION_STATUS_LABELS: Record<VariationStatus, string> = {
  Pendiente: "Pendiente",
  Aprobada: "Aprobada",
  Rechazada: "Rechazada",
};

export const VARIATION_TYPE_OPTIONS: SelectOption[] = [
  { value: "Alcance", label: "Alcance" },
  { value: "Plazo", label: "Plazo" },
  { value: "Recursos", label: "Recursos" },
];

export const VARIATION_TYPE_FILTER_OPTIONS: SelectOption[] = [
  { value: "", label: "Todos" },
  ...VARIATION_TYPE_OPTIONS,
];

export const VARIATION_STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: "", label: "Todas" },
  { value: "Pendiente", label: "Pendiente" },
  { value: "Aprobada", label: "Aprobada" },
  { value: "Rechazada", label: "Rechazada" },
];

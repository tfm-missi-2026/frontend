import type {
  VariationStatus,
  VariationTarget,
  VariationType,
} from "./variation";

export interface VariationFormData {
  target: VariationTarget | null;
  type: VariationType;
  description: string;
  justification: string;
  previousValue: string;
  newValue: string;
  detectionDate: string;
}

export interface ResolveVariationFormData {
  decision: Exclude<VariationStatus, "Pendiente"> | null;
  observation: string;
}

export function emptyVariationForm(): VariationFormData {
  return {
    target: null,
    type: "Plazo",
    description: "",
    justification: "",
    previousValue: "",
    newValue: "",
    detectionDate: "",
  };
}

export function emptyResolveForm(): ResolveVariationFormData {
  return { decision: null, observation: "" };
}

export interface ReportVariationPayload {
  data: VariationFormData;
  reportedBy: string;
}

export interface ResolveVariationPayload {
  id: string;
  decision: Exclude<VariationStatus, "Pendiente">;
  observation: string;
  resolvedBy: string;
}

import type { Type } from "@angular/core";

import type { FlexJustify } from "@shared/ui/flex/flex.component";

export type UiModalRounded =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

export type UiModalSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "full";

export type UiModalFooterAlign = FlexJustify | "between";

export type UiModalFooterVariant = "default" | "sticky";

export type UiModalActionVariant = "primary" | "secondary" | "tertiary";

export type UiModalActionStyleType = "default" | "danger";

export interface UiModalAction {
  label: string;
  icon?: Type<unknown>;
  variant?: UiModalActionVariant;
  styleType?: UiModalActionStyleType;
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
}

import { TemplateRef, Type } from '@angular/core';

import { IconProps } from '@ui/icon/icon.interface';
import { TypographyType } from '@styles/types/typography';
import {
  TooltipVariantType,
  TooltipSide,
} from '@ui/tooltip/tooltip.types';

/** Variante visual del botón (define la "jerarquía" principal). */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

/** Estilo adicional encima de la variant (color semántico). */
export type ButtonStyleType = 'default' | 'danger' | 'monochrome' | 'warning' | 'success';

/** Contenido válido para el `tooltip` del botón. */
export type ButtonTooltip = string | TemplateRef<unknown>;

/**
 * Props del enlace (`<a>`) cuando se renderiza el botón como link.
 * Subset de `HTMLAnchorElement` alineado con el proyecto React.
 */
export interface ButtonLinkProps {
  href?: string;
  target?: string;
  download?: boolean | string;
  rel?: string;
}

/**
 * Props comunes a `Button` e `IconButton`.
 * Replica el `ButtonCommonProps` del proyecto React.
 */
export interface ButtonCommonProps {
  /** Variante principal. Default: `'primary'`. */
  variant?: ButtonVariant;

  /** Estilo semántico. Default: `'default'`. */
  styleType?: ButtonStyleType;

  /** Si `true`, el fondo es transparente (solo `secondary`/`tertiary`). */
  transparent?: boolean;

  /** Reduce el padding. */
  compact?: boolean;

  /** Hace que el botón ocupe el 100% del ancho de su contenedor. */
  fullWidth?: boolean;

  /** Deshabilita el botón. */
  disabled?: boolean;

  /** `type="submit"` (default `'button'`). */
  isSubmit?: boolean;

  /** Muestra estado de carga (deshabilita + progress bar). */
  isLoading?: boolean;

  /** Tipografía del texto. Default: `'bodyS'`. */
  fontSize?: TypographyType;

  /** Mapea a `aria-label`. */
  labelText?: string;

  /**
   * Tooltip a mostrar al hover/focus. Acepta texto plano o un
   * `TemplateRef` para contenido enriquecido.
   */
  tooltip?: ButtonTooltip;

  /** Lado preferido del tooltip. Default: `'bottom'`. */
  tooltipSide?: TooltipSide;

  /** Variante del tooltip. Default: `'dark'`. */
  tooltipVariant?: TooltipVariantType;

  /** Clases extra para el contenedor exterior. */
  className?: string;

  /**
   * Si se define, muestra una progress bar animada y deshabilita
   * el botón durante `disableOnTimeout`. En milisegundos.
   */
  timeout?: number;

  /**
   * Si `true` (default), deshabilita el botón mientras el `timeout`
   * está corriendo.
   */
  disableOnTimeout?: boolean;

  /**
   * Si `true`, el botón se renderiza como `<a>` en vez de `<button>`.
   * Usar junto con `linkProps`.
   */
  asLink?: boolean;

  /** Props del enlace, aplicables solo si `asLink` es `true`. */
  linkProps?: ButtonLinkProps;
}

/**
 * Props del `Button` (con label + 2 íconos opcionales).
 * Réplica de `buttonProps` de React.
 */
export interface ButtonProps extends ButtonCommonProps {
  /** Componente Angular a renderizar a la izquierda del label. */
  LeftIcon?: Type<unknown>;

  /** Componente Angular a renderizar a la derecha del label. */
  RightIcon?: Type<unknown>;

  /** Props para los íconos (size por defecto = `fontSize`). */
  iconProps?: IconProps;

  /** Texto del botón (alternativa al slot `<ng-content>`). */
  label?: string;

  /**
   * TemplateRef alternativa a `label` para contenido complejo.
   * Si se define, pisa a `label`.
   */
  labelRender?: TemplateRef<unknown>;
}

/**
 * Props del `IconButton` (un solo ícono, sin label).
 * Réplica de `iconButtonProps` de React.
 */
export interface IconButtonProps extends ButtonCommonProps {
  /** Componente Angular a renderizar dentro del botón. */
  Icon: Type<unknown>;

  /** Props para el ícono (size por defecto = `fontSize`). */
  iconProps?: IconProps;

  /**
   * Ancho explícito del botón (sobrescribe aspect-ratio 1:1).
   * Útil cuando `Icon` necesita más espacio del que permite
   * el aspect-ratio cuadrado por defecto.
   */
  width?: string;
}

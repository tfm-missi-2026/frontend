import { ButtonStyleType, ButtonVariant } from "./button.types";

/** Ancho del borde, constante para todos los botones. */
export const buttonBorderWidth = "1px";

/**
 * Tokens semánticos que el consumidor puede asignar a cada slot
 * (background / border / color) de un variant.
 *
 * Cada slot define su par light + dark para que el botón responda
 * al cambio de tema. Los nombres de clase son literales (no se
 * interpolan) para que el JIT de Tailwind los detecte.
 */
export type ColorToken =
  | "brand-500"
  | "brand-600"
  | "error-500"
  | "error-600"
  | "gray-100"
  | "gray-200"
  | "gray-300"
  | "gray-500"
  | "gray-700"
  | "gray-800"
  | "gray-900"
  | "warning-500"
  | "warning-600"
  | "success-500"
  | "success-600"
  | "white"
  | "transparent";

type ColorState = {
  background: ColorToken;
  border: ColorToken;
  color: ColorToken;
};

type ColorPalette = {
  [V in ButtonVariant]: {
    [S in ButtonStyleType]: {
      idle: ColorState;
      hover: ColorState;
    };
  };
};

/**
 * Paleta completa. Estructura: `variant.styleType.{idle|hover}.{background|border|color}`.
 * Si una celda está vacía, no se aplica (cae al default).
 */
export const buttonColorXvariant: ColorPalette = {
  primary: {
    default: {
      idle: { background: "brand-500", border: "brand-500", color: "white" },
      hover: { background: "brand-600", border: "brand-600", color: "white" },
    },
    danger: {
      idle: { background: "error-500", border: "error-500", color: "white" },
      hover: { background: "error-600", border: "error-600", color: "white" },
    },
    monochrome: {
      idle: { background: "gray-800", border: "gray-900", color: "white" },
      hover: { background: "gray-900", border: "gray-900", color: "white" },
    },
    warning: {
      idle: {
        background: "warning-500",
        border: "warning-500",
        color: "white",
      },
      hover: {
        background: "warning-600",
        border: "warning-600",
        color: "white",
      },
    },
    success: {
      idle: {
        background: "success-500",
        border: "success-500",
        color: "white",
      },
      hover: {
        background: "success-600",
        border: "success-600",
        color: "white",
      },
    },
  },
  secondary: {
    default: {
      idle: { background: "white", border: "gray-200", color: "brand-500" },
      hover: {
        background: "gray-100",
        border: "brand-500",
        color: "brand-600",
      },
    },
    danger: {
      idle: { background: "white", border: "gray-200", color: "error-500" },
      hover: {
        background: "gray-100",
        border: "error-500",
        color: "error-600",
      },
    },
    monochrome: {
      idle: { background: "white", border: "gray-200", color: "gray-800" },
      hover: { background: "gray-100", border: "gray-800", color: "gray-500" },
    },
    warning: {
      idle: { background: "white", border: "gray-200", color: "warning-500" },
      hover: {
        background: "gray-100",
        border: "warning-500",
        color: "warning-600",
      },
    },
    success: {
      idle: { background: "white", border: "gray-200", color: "success-500" },
      hover: {
        background: "gray-100",
        border: "success-500",
        color: "success-600",
      },
    },
  },
  tertiary: {
    default: {
      idle: { background: "white", border: "white", color: "brand-500" },
      hover: { background: "gray-100", border: "gray-100", color: "brand-600" },
    },
    danger: {
      idle: { background: "white", border: "white", color: "error-500" },
      hover: { background: "gray-100", border: "gray-100", color: "error-600" },
    },
    monochrome: {
      idle: { background: "white", border: "white", color: "gray-800" },
      hover: { background: "gray-100", border: "gray-100", color: "gray-500" },
    },
    warning: {
      idle: { background: "white", border: "white", color: "warning-500" },
      hover: {
        background: "gray-100",
        border: "gray-100",
        color: "warning-600",
      },
    },
    success: {
      idle: { background: "white", border: "white", color: "success-500" },
      hover: {
        background: "gray-100",
        border: "gray-100",
        color: "success-600",
      },
    },
  },
};

// Mapas `token → clase Tailwind light+dark` con strings LITERALES.
//
// CRÍTICO: el JIT de Tailwind escanea el código fuente en busca de nombres
// de clase *literales*. Si construimos `bg-${token}` con template literals,
// el scanner NO ve `bg-brand-500` y el CSS nunca se genera. Por eso
// tenemos que explicitar el string completo en este mapa.
//
// Cada token aparece como `light dark:dark` para que el botón reaccione
// al cambio de tema. Cualquier token nuevo que se agregue a `ColorToken`
// DEBE aparecer como valor en estos mapas.

const BG: Record<ColorToken, string> = {
  transparent: "bg-transparent dark:bg-transparent",
  white: "bg-white dark:bg-gray-900",
  "brand-500": "bg-brand-500 dark:bg-brand-600",
  "brand-600": "bg-brand-600 dark:bg-brand-500",
  "error-500": "bg-error-500 dark:bg-error-600",
  "error-600": "bg-error-600 dark:bg-error-500",
  "gray-100": "bg-gray-100 dark:bg-gray-800",
  "gray-200": "bg-gray-200 dark:bg-gray-700",
  "gray-300": "bg-gray-300 dark:bg-gray-600",
  "gray-500": "bg-gray-500 dark:bg-gray-500",
  "gray-700": "bg-gray-700 dark:bg-gray-300",
  "gray-800": "bg-gray-800 dark:bg-gray-700",
  "gray-900": "bg-gray-900 dark:bg-gray-800",
  "warning-500": "bg-warning-500 dark:bg-warning-600",
  "warning-600": "bg-warning-600 dark:bg-warning-500",
  "success-500": "bg-success-500 dark:bg-success-600",
  "success-600": "bg-success-600 dark:bg-success-500",
};

const BG_HOVER: Record<ColorToken, string> = {
  transparent: "hover:bg-transparent dark:hover:bg-transparent",
  white: "hover:bg-white dark:hover:bg-gray-900",
  "brand-500": "hover:bg-brand-500 dark:hover:bg-brand-600",
  "brand-600": "hover:bg-brand-600 dark:hover:bg-brand-500",
  "error-500": "hover:bg-error-500 dark:hover:bg-error-600",
  "error-600": "hover:bg-error-600 dark:hover:bg-error-500",
  "gray-100": "hover:bg-gray-100 dark:hover:bg-gray-800",
  "gray-200": "hover:bg-gray-200 dark:hover:bg-gray-700",
  "gray-300": "hover:bg-gray-300 dark:hover:bg-gray-600",
  "gray-500": "hover:bg-gray-500 dark:hover:bg-gray-500",
  "gray-700": "hover:bg-gray-700 dark:hover:bg-gray-300",
  "gray-800": "hover:bg-gray-800 dark:hover:bg-gray-700",
  "gray-900": "hover:bg-gray-900 dark:hover:bg-gray-800",
  "warning-500": "hover:bg-warning-500 dark:hover:bg-warning-600",
  "warning-600": "hover:bg-warning-600 dark:hover:bg-warning-500",
  "success-500": "hover:bg-success-500 dark:hover:bg-success-600",
  "success-600": "hover:bg-success-600 dark:hover:bg-success-500",
};

const BORDER: Record<ColorToken, string> = {
  transparent: "border-transparent dark:border-transparent",
  white: "border-white dark:border-gray-900",
  "brand-500": "border-brand-500 dark:border-brand-600",
  "brand-600": "border-brand-600 dark:border-brand-500",
  "error-500": "border-error-500 dark:border-error-600",
  "error-600": "border-error-600 dark:border-error-500",
  "gray-100": "border-gray-100 dark:border-gray-800",
  "gray-200": "border-gray-200 dark:border-gray-700",
  "gray-300": "border-gray-300 dark:border-gray-600",
  "gray-500": "border-gray-500 dark:border-gray-500",
  "gray-700": "border-gray-700 dark:border-gray-300",
  "gray-800": "border-gray-800 dark:border-gray-700",
  "gray-900": "border-gray-900 dark:border-gray-800",
  "warning-500": "border-warning-500 dark:border-warning-600",
  "warning-600": "border-warning-600 dark:border-warning-500",
  "success-500": "border-success-500 dark:border-success-600",
  "success-600": "border-success-600 dark:border-success-500",
};

const BORDER_HOVER: Record<ColorToken, string> = {
  transparent: "hover:border-transparent dark:hover:border-transparent",
  white: "hover:border-white dark:hover:border-gray-900",
  "brand-500": "hover:border-brand-500 dark:hover:border-brand-600",
  "brand-600": "hover:border-brand-600 dark:hover:border-brand-500",
  "error-500": "hover:border-error-500 dark:hover:border-error-600",
  "error-600": "hover:border-error-600 dark:hover:border-error-500",
  "gray-100": "hover:border-gray-100 dark:hover:border-gray-800",
  "gray-200": "hover:border-gray-200 dark:hover:border-gray-700",
  "gray-300": "hover:border-gray-300 dark:hover:border-gray-600",
  "gray-500": "hover:border-gray-500 dark:hover:border-gray-500",
  "gray-700": "hover:border-gray-700 dark:hover:border-gray-300",
  "gray-800": "hover:border-gray-800 dark:hover:border-gray-700",
  "gray-900": "hover:border-gray-900 dark:hover:border-gray-800",
  "warning-500": "hover:border-warning-500 dark:hover:border-warning-600",
  "warning-600": "hover:border-warning-600 dark:hover:border-warning-500",
  "success-500": "hover:border-success-500 dark:hover:border-success-600",
  "success-600": "hover:border-success-600 dark:hover:border-success-500",
};

const TEXT: Record<ColorToken, string> = {
  transparent: "text-transparent dark:text-transparent",
  white: "text-white dark:text-white",
  "brand-500": "text-brand-500 dark:text-brand-400",
  "brand-600": "text-brand-600 dark:text-brand-300",
  "error-500": "text-error-500 dark:text-error-400",
  "error-600": "text-error-600 dark:text-error-300",
  "gray-100": "text-gray-100 dark:text-gray-100",
  "gray-200": "text-gray-200 dark:text-gray-200",
  "gray-300": "text-gray-300 dark:text-gray-300",
  "gray-500": "text-gray-500 dark:text-gray-400",
  "gray-700": "text-gray-700 dark:text-gray-200",
  "gray-800": "text-gray-800 dark:text-gray-100",
  "gray-900": "text-gray-900 dark:text-gray-50",
  "warning-500": "text-warning-500 dark:text-warning-400",
  "warning-600": "text-warning-600 dark:text-warning-300",
  "success-500": "text-success-500 dark:text-success-400",
  "success-600": "text-success-600 dark:text-success-300",
};

const TEXT_HOVER: Record<ColorToken, string> = {
  transparent: "hover:text-transparent dark:hover:text-transparent",
  white: "hover:text-white dark:hover:text-white",
  "brand-500": "hover:text-brand-500 dark:hover:text-brand-400",
  "brand-600": "hover:text-brand-600 dark:hover:text-brand-300",
  "error-500": "hover:text-error-500 dark:hover:text-error-400",
  "error-600": "hover:text-error-600 dark:hover:text-error-300",
  "gray-100": "hover:text-gray-100 dark:hover:text-gray-100",
  "gray-200": "hover:text-gray-200 dark:hover:text-gray-200",
  "gray-300": "hover:text-gray-300 dark:hover:text-gray-300",
  "gray-500": "hover:text-gray-500 dark:hover:text-gray-400",
  "gray-700": "hover:text-gray-700 dark:hover:text-gray-200",
  "gray-800": "hover:text-gray-800 dark:hover:text-gray-100",
  "gray-900": "hover:text-gray-900 dark:hover:text-gray-50",
  "warning-500": "hover:text-warning-500 dark:hover:text-warning-400",
  "warning-600": "hover:text-warning-600 dark:hover:text-warning-300",
  "success-500": "hover:text-success-500 dark:hover:text-success-400",
  "success-600": "hover:text-success-600 dark:hover:text-success-300",
};

/**
 * Devuelve el string de clases Tailwind para una combinación
 * variant × styleType, respetando `transparent` (solo aplica
 * a `secondary` y `tertiary`). Todas las clases llevan su par
 * `dark:` para que el botón reaccione al cambio de tema.
 */
export const getVariantClasses = (
  variant: ButtonVariant,
  styleType: ButtonStyleType,
  transparent: boolean,
): string => {
  const colors = buttonColorXvariant[variant]?.[styleType];
  if (!colors) return "";

  const isPrimary = variant === "primary";
  const idleBg =
    transparent && !isPrimary ? "transparent" : colors.idle.background;
  const idleBorder =
    transparent && !isPrimary ? "transparent" : colors.idle.border;

  return [
    BG[idleBg],
    BORDER[idleBorder],
    TEXT[colors.idle.color],
    BG_HOVER[colors.hover.background],
    BORDER_HOVER[colors.hover.border],
    TEXT_HOVER[colors.hover.color],
    "focus-visible:" + BG[colors.hover.background].replace(/^bg-/, "bg-"),
    "focus-visible:" +
      BORDER[colors.hover.border].replace(/^border-/, "border-"),
    "focus-visible:" + TEXT[colors.hover.color].replace(/^text-/, "text-"),
    "disabled:bg-gray-200 dark:disabled:bg-gray-700",
    "disabled:border-gray-200 dark:disabled:border-gray-700",
    "disabled:text-gray-300 dark:disabled:text-gray-600",
    "disabled:cursor-not-allowed",
  ]
    .filter(Boolean)
    .join(" ");
};

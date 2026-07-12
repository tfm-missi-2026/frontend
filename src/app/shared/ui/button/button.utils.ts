import {
  ButtonStyleType,
  ButtonVariant,
  ColorToken,
} from "./button.types";
import {
  BG,
  BG_HOVER,
  BORDER,
  BORDER_HOVER,
  TEXT,
  TEXT_HOVER,
} from "./button.utils.tokens";

/** Ancho del borde, constante para todos los botones. */
export const buttonBorderWidth = "1px";

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

// Paleta variant × styleType × {idle, hover} × {background, border, color}.
// Celdas vacías en runtime (no se da el caso) caen al default.
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

// Devuelve las clases Tailwind (con par `dark:`) para variant × styleType,
// respetando `transparent` (solo válido en `secondary`/`tertiary`).
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

import type {
  UiModalRounded,
  UiModalSize,
} from "./modal.types";

export const SIZE_MIN_CLASS_MAP: Record<UiModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)]",
};

export const ROUNDED_CLASS_MAP: Record<UiModalRounded, string> = {
  none: "",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

export const MODAL_CONTENT_CLASSES = [
  "relative flex flex-col w-full mx-auto max-h-[calc(100vh-2rem)] shadow-theme-xl",
  "sm:max-h-[calc(100vh-3rem)]",
  "bg-white dark:bg-gray-900",
  "ring-1 ring-black/5 dark:ring-white/10",
];

export const MODAL_CLOSE_BUTTON_CLASSES = [
  "absolute right-3 top-3 z-20",
  "flex h-8 w-8 items-center justify-center",
  "rounded-md text-gray-400",
  "transition-colors",
  "hover:bg-gray-100 hover:text-gray-700",
  "dark:hover:bg-gray-800 dark:hover:text-white",
  "sm:right-4 sm:top-4",
];

export const MODAL_HEADER_CLASSES = [
  "flex-col gap-1 pr-12 pl-4 pt-4",
  "sm:pl-5 sm:pt-4",
  "lg:pl-6 lg:pt-4",
];

export const MODAL_BODY_CLASSES = [
  "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto",
  "px-4 sm:px-5 lg:px-6",
  "pt-4 sm:pt-5 lg:pt-6",
  "pb-4 sm:pb-5 lg:pb-6",
];

export const MODAL_FOOTER_CLASSES = [
  "shrink-0 flex-wrap",
  "border-t border-gray-200 dark:border-gray-800",
  "bg-white dark:bg-gray-900",
  "px-4 py-3 sm:px-5 sm:py-4 lg:px-6",
  "rounded-b-xl",
];

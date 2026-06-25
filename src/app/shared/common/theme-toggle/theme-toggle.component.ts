import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";

import { ThemeService } from "@shared/services/theme.service";
import { IconMoonComponent, IconSunComponent } from "@shared/icons";
import { getFocusStyling } from "@utils/styling";

import { CommonThemeToggleSize, CommonThemeToggleVariant } from "./types";

const SIZE_CLASSES: Record<CommonThemeToggleSize, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "size-14",
};

const VARIANT_CLASSES: Record<CommonThemeToggleVariant, string> = {
  subtle:
    "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-700 " +
    "dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-white",
  brand: "bg-brand-500 text-white hover:bg-brand-600 border border-transparent",
};

const BASE_CLASSES =
  "relative inline-flex items-center justify-center rounded-full transition-colors cursor-pointer select-none";

/**
 * `CommonThemeToggle`
 * -------------------
 * Botón del namespace `common/` para alternar entre tema claro y oscuro.
 *
 * Lee el estado actual de `ThemeService` vía `toSignal` y muestra el
 * ícono de la **acción destino** (sol en modo oscuro → click cambia a
 * claro; luna en modo claro → click cambia a oscuro).
 *
 * Variantes:
 *  - `subtle` (default): botón monocromo, recomendado para el header
 *    autenticado.
 *  - `brand`: círculo sólido de marca, recomendado para el auth layout.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "CommonThemeToggle",
  standalone: true,
  imports: [IconSunComponent, IconMoonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-pressed]="isDark()"
      (click)="toggle()"
    >
      @if (isDark()) {
        <IconSun [size]="iconSize()" />
      } @else {
        <IconMoon [size]="iconSize()" />
      }
    </button>
  `,
})
export class CommonThemeToggleComponent {
  /** Estilo visual. Default: `subtle`. */
  readonly variant = input<CommonThemeToggleVariant>("subtle");
  /** Tamaño del botón. Default: `md`. */
  readonly size = input<CommonThemeToggleSize>("md");
  /** Clases extra aplicadas al botón. */
  readonly className = input<string>("");
  /** Etiqueta accesible. Default: `'Toggle theme'`. */
  readonly ariaLabel = input<string>("Toggle theme");

  private readonly themeService = inject(ThemeService);

  protected readonly currentTheme = toSignal(this.themeService.theme$, {
    initialValue: "light" as "light" | "dark",
  });

  protected readonly isDark = computed<boolean>(
    () => this.currentTheme() === "dark",
  );

  protected readonly buttonClasses = computed<string>(() => {
    const focus = getFocusStyling("visible");
    return [
      BASE_CLASSES,
      VARIANT_CLASSES[this.variant()],
      SIZE_CLASSES[this.size()],
      this.className(),
      focus,
    ]
      .filter(Boolean)
      .join(" ");
  });

  protected readonly iconSize = computed<number>(() => {
    switch (this.size()) {
      case "sm":
        return 16;
      case "lg":
        return 24;
      case "md":
      default:
        return 20;
    }
  });

  protected toggle(): void {
    this.themeService.toggleTheme();
  }
}

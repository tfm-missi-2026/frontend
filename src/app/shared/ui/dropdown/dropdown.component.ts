import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  viewChild,
} from "@angular/core";
import { isPlatformBrowser, NgClass } from "@angular/common";

import { DropdownAlignment } from "./dropdown.types";

/**
 * `UiDropdown`
 * ------------
 * Contenedor genérico de dropdown. Renderiza un panel absoluto
 * posicionado respecto a su trigger, con click-outside y soporte
 * para `Escape` como atajo de cierre.
 *
 * Uso:
 * ```html
 * <div class="relative">
 *   <button class="dropdown-toggle" (click)="open.set(!open())">…</button>
 *   <UiDropdown [isOpen]="open()" (close)="open.set(false)">
 *     <!-- contenido proyectado: <UiDropdownItem>, listas, etc. -->
 *   </UiDropdown>
 * </div>
 * ```
 *
 * Características:
 *  - Click-outside: cierra el dropdown al hacer click fuera del
 *    panel y fuera de cualquier elemento con la clase
 *    `.dropdown-toggle` (compatible con el patrón de trigger usado
 *    en los dropdowns del template original).
 *  - `Escape`: cierra el dropdown al pulsar la tecla `Escape`.
 *  - Posicionamiento: acepta `align` (`right` | `left` | `center`).
 *  - Render condicional: no se monta el DOM cuando `isOpen` es
 *    `false`.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiDropdown",
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./dropdown.component.html",
})
export class UiDropdownComponent implements AfterViewInit, OnDestroy {
  /** Estado de visibilidad del dropdown. */
  readonly isOpen = input<boolean>(false);
  /** Clases extra aplicadas al panel. */
  readonly className = input<string>("");
  /** Alineación horizontal del panel. Default: `right`. */
  readonly align = input<DropdownAlignment>("right");
  /** Si `true`, cierra el dropdown al pulsar `Escape`. Default: `true`. */
  readonly closeOnEscape = input<boolean>(true);
  /** Si `true`, cierra al hacer click fuera del panel. Default: `true`. */
  readonly closeOnOutsideClick = input<boolean>(true);
  /**
   * Selector CSS que identifica los triggers válidos. El click
   * sobre uno de estos elementos NO cierra el dropdown. Default:
   * `.dropdown-toggle`.
   */
  readonly triggerSelector = input<string>(".dropdown-toggle");

  /** Emite cuando el dropdown debe cerrarse (click-outside, Escape). */
  readonly close = output<void>();

  readonly panelRef =
    viewChild<ElementRef<HTMLDivElement>>("dropdownRef");

  private readonly platformId = inject(PLATFORM_ID);
  private readonly _document = signal<Document | null>(null);

  private readonly handleClickOutside = (event: MouseEvent): void => {
    if (!this.isOpen()) return;
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return;

    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (panel.contains(target)) return;

    const trigger = target.closest(this.triggerSelector());
    if (trigger) return;

    this.close.emit();
  };

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.isOpen()) return;
    if (event.key === "Escape" && this.closeOnEscape()) {
      event.preventDefault();
      this.close.emit();
    }
  };

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const doc = this._document() ?? document;
    this._document.set(doc);
    doc.addEventListener("mousedown", this.handleClickOutside);
    doc.addEventListener("keydown", this.handleKeyDown);
  }

  ngOnDestroy(): void {
    const doc = this._document();
    if (!doc) return;
    doc.removeEventListener("mousedown", this.handleClickOutside);
    doc.removeEventListener("keydown", this.handleKeyDown);
  }

  /** Clases del panel, combinando layout base + `className` + `align`. */
  readonly panelClasses = computed<string>(() => {
    const alignClass =
      this.align() === "left"
        ? "left-0"
        : this.align() === "center"
          ? "left-1/2 -translate-x-1/2"
          : "right-0";

    return [
      "absolute z-40 mt-2 rounded-xl border border-gray-200 bg-white shadow-theme-lg",
      "dark:border-gray-800 dark:bg-gray-dark",
      alignClass,
      this.className(),
    ]
      .filter(Boolean)
      .join(" ");
  });

  /** Resuelve el `align` para usar en `[ngClass]`. */
  readonly alignClass = computed<string>(() => {
    const align = this.align();
    if (align === "left") return "left-0";
    if (align === "center") return "left-1/2 -translate-x-1/2";
    return "right-0";
  });
}

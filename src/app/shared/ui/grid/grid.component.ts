import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { GridBreakpoint, GridColumns } from "./grid.types";

/**
 * Mapa de breakpoints al sufijo Tailwind `grid-cols-{N}`.
 * Cada entry declara explícitamente la clase para que el compilador
 * de Tailwind la detecte (no se construyen con template literals).
 */
const COLS_CLASSES: Record<GridBreakpoint, Record<GridColumns, string>> = {
  sm: {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
  },
  md: {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
  },
  lg: {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  },
  xl: {
    2: "xl:grid-cols-2",
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
    5: "xl:grid-cols-5",
    6: "xl:grid-cols-6",
  },
  "2xl": {
    2: "2xl:grid-cols-2",
    3: "2xl:grid-cols-3",
    4: "2xl:grid-cols-4",
    5: "2xl:grid-cols-5",
    6: "2xl:grid-cols-6",
  },
};

/**
 * `UiGrid`
 * -------
 * Contenedor de layout responsive que colapsa a una columna en mobile
 * y pasa a N columnas a partir del breakpoint configurado.
 *
 * Es 100% genérico: el componente solo provee el grid layout, el
 * consumidor proyecta cualquier contenido vía `<ng-content>`. Por
 * ejemplo: imágenes (`UiImage`), cards, avatares, etc.
 *
 * Accesibilidad:
 *  - El contenedor expone `role="list"` para que los lectores de
 *    pantalla anuncien el conjunto como una lista.
 *  - `aria-label` es configurable para describir el contenido.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiGrid",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./grid.component.html",
})
export class UiGridComponent {
  /** Cantidad de columnas a partir del breakpoint. Default `2`. */
  readonly columns = input<GridColumns>(2);
  /** Breakpoint en el que se aplica la cantidad de columnas. Default `sm`. */
  readonly breakpoint = input<GridBreakpoint>("sm");
  /** `gap` de Tailwind entre celdas. Default `gap-5`. */
  readonly gap = input<string>("gap-5");
  /** Etiqueta accesible del grid. */
  readonly ariaLabel = input<string>("Grid");
  /** Clases extra para el contenedor. */
  readonly className = input<string>("");

  /** Clases del contenedor. */
  readonly containerClasses = computed<string>(() =>
    [
      "grid grid-cols-1",
      this.gap(),
      COLS_CLASSES[this.breakpoint()][this.columns()],
      this.className(),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

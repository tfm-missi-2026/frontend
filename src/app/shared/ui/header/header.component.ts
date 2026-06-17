import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import designConstants, {
  ColorType,
  FontWeightType,
  TypographyType,
} from "@styles/constants";
import { UiHeaderLevel } from "./header.types";

const LEVEL_TO_TYPOGRAPHY: Record<UiHeaderLevel, TypographyType> = {
  1: "HeadingXxl",
  2: "HeadingXl",
  3: "HeadingL",
  4: "HeadingM",
  5: "HeadingS",
};

const LEVEL_TO_TAG: Record<UiHeaderLevel, string> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
};

/**
 * `UiHeader`
 * ---------
 * Encabezado semántico (h1–h5) con tipografía y color del design system.
 *
 * El nivel (`level`) define el `font-size` y `line-height` por defecto
 * a partir de `designConstants.typography`. El peso y el color son
 * opcionales: si se omiten, se usan los valores por defecto del tipo
 * de tipografía resuelto.
 *
 * Casos de uso:
 *  - `<UiHeader level="1">` → h1, 24px, bold.
 *  - `<UiHeader level="3" color="textStrong">` → h3, 18px, semibold.
 *  - `<UiHeader [level]="3" [as]="'h2'>` → renderiza `<h2>` con
 *    tipografía de nivel 3 (útil para ajustar jerarquía visual sin
 *    cambiar la semántica del documento).
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiHeader",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (resolvedTag()) {
      @case ("h1") {
        <h1
          [id]="id() || null"
          [class]="containerClasses()"
          [style.color]="resolvedColor()"
          [style.font-weight]="resolvedWeight()"
          [style.font-size]="resolvedFontSize()"
          [style.line-height]="resolvedLineHeight()"
        >
          @if (text()) {
            {{ text() }}
          } @else {
            <ng-content></ng-content>
          }
        </h1>
      }
      @case ("h2") {
        <h2
          [id]="id() || null"
          [class]="containerClasses()"
          [style.color]="resolvedColor()"
          [style.font-weight]="resolvedWeight()"
          [style.font-size]="resolvedFontSize()"
          [style.line-height]="resolvedLineHeight()"
        >
          @if (text()) {
            {{ text() }}
          } @else {
            <ng-content></ng-content>
          }
        </h2>
      }
      @case ("h3") {
        <h3
          [id]="id() || null"
          [class]="containerClasses()"
          [style.color]="resolvedColor()"
          [style.font-weight]="resolvedWeight()"
          [style.font-size]="resolvedFontSize()"
          [style.line-height]="resolvedLineHeight()"
        >
          @if (text()) {
            {{ text() }}
          } @else {
            <ng-content></ng-content>
          }
        </h3>
      }
      @case ("h4") {
        <h4
          [id]="id() || null"
          [class]="containerClasses()"
          [style.color]="resolvedColor()"
          [style.font-weight]="resolvedWeight()"
          [style.font-size]="resolvedFontSize()"
          [style.line-height]="resolvedLineHeight()"
        >
          @if (text()) {
            {{ text() }}
          } @else {
            <ng-content></ng-content>
          }
        </h4>
      }
      @case ("h5") {
        <h5
          [id]="id() || null"
          [class]="containerClasses()"
          [style.color]="resolvedColor()"
          [style.font-weight]="resolvedWeight()"
          [style.font-size]="resolvedFontSize()"
          [style.line-height]="resolvedLineHeight()"
        >
          @if (text()) {
            {{ text() }}
          } @else {
            <ng-content></ng-content>
          }
        </h5>
      }
    }
  `,
})
export class UiHeaderComponent {
  /** Nivel semántico del encabezado (1–5). Default: `1`. */
  readonly level = input<UiHeaderLevel>(1);
  /** Tag HTML concreto. Si se omite, se infiere de `level`. */
  readonly as = input<UiHeaderLevel | undefined>(undefined);
  /** `id` del encabezado (para anclas y `aria-labelledby`). */
  readonly id = input<string | undefined>(undefined);
  /** Texto a mostrar (alternativa al slot). */
  readonly text = input<string | undefined>(undefined);
  /** `font-weight`. Si se omite, usa el del `TypographyType` resuelto. */
  readonly weight = input<FontWeightType | undefined>(undefined);
  /** Color semántico. Si se omite, usa `currentColor`. */
  readonly color = input<ColorType | undefined>(undefined);
  /** Clases extra para el contenedor. */
  readonly className = input<string>("");

  readonly resolvedTag = computed<string>(
    () => LEVEL_TO_TAG[this.as() ?? this.level()],
  );

  readonly resolvedTypography = computed<TypographyType>(
    () => LEVEL_TO_TYPOGRAPHY[this.level()],
  );

  readonly resolvedColor = computed<string>(() => {
    const c = this.color();
    if (!c) return "currentColor";
    return designConstants.colors[c] ?? "currentColor";
  });

  readonly resolvedWeight = computed<string>(() => {
    const w =
      this.weight() ??
      designConstants.typography.fontWeightByTypographyType[
        this.resolvedTypography()
      ];
    return designConstants.typography.fontWeight[w].toString();
  });

  readonly resolvedFontSize = computed<string>(
    () => designConstants.typography.fontSize[this.resolvedTypography()],
  );

  readonly resolvedLineHeight = computed<string>(
    () => designConstants.typography.lineHeight[this.resolvedTypography()],
  );

  readonly containerClasses = computed<string>(() => {
    const extra = this.className();
    return extra ? `font-outfit ${extra}` : "font-outfit";
  });
}

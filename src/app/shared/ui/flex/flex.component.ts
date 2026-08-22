import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

/** Variantes tipadas para `flex-direction`. */
export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";

/** Variantes tipadas para `justify-content` (sin prefijo `justify-`). */
export type FlexJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

/** Variantes tipadas para `align-items` (sin prefijo `items-`). */
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";

/** Variantes tipadas para `overflow`. */
export type FlexOverflow = "auto" | "hidden" | "visible" | "scroll";

/** Variantes tipadas para `flex` shorthand. */
export type FlexFlex = "1" | "auto" | "initial" | "none";

/** Variantes tipadas para `gap`. */
export type FlexGap =
  | 0
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 5
  | 6
  | 7
  | 8
  | 10
  | 12
  | 16
  | 20
  | 24;

const DIRECTION_CLASSES: Record<FlexDirection, string> = {
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
  column: "flex-col",
  "column-reverse": "flex-col-reverse",
};

const JUSTIFY_CLASSES: Record<FlexJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const ALIGN_CLASSES: Record<FlexAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const OVERFLOW_CLASSES: Record<FlexOverflow, string> = {
  auto: "overflow-auto",
  hidden: "overflow-hidden",
  visible: "overflow-visible",
  scroll: "overflow-scroll",
};

const FLEX_CLASSES: Record<FlexFlex, string> = {
  "1": "flex-1",
  auto: "flex-auto",
  initial: "flex-initial",
  none: "flex-none",
};

const GAP_CLASSES: Record<FlexGap, string> = {
  0: "gap-0",
  0.5: "gap-0.5",
  1: "gap-1",
  1.5: "gap-1.5",
  2: "gap-2",
  2.5: "gap-2.5",
  3: "gap-3",
  3.5: "gap-3.5",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  7: "gap-7",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
  20: "gap-20",
  24: "gap-24",
};

/**
 * `UiFlex`
 * --------
 * Contenedor `display: flex` parametrizable con variantes tipadas de
 * Tailwind. Acepta dirección, alineación, justificación, gap, wrap,
 * overflow y `flex` shorthand a través de inputs signal-based.
 *
 * Las "custom props" no se filtran al DOM porque en Angular los
 * `input()` signals no se reenvían como atributos HTML.
 */
@Component({
  selector: "UiFlex",
  standalone: true,
  host: { class: "contents" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="classes()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-hidden]="ariaHidden() ? 'true' : null"
    >
      <ng-content />
    </div>
  `,
})
export class UiFlexComponent {
  readonly direction = input<FlexDirection>("row");
  readonly justifyContent = input<FlexJustify | undefined>(undefined);
  readonly alignItems = input<FlexAlign | undefined>(undefined);
  readonly gap = input<FlexGap | undefined>(undefined);
  readonly flex = input<FlexFlex | undefined>(undefined);
  readonly overflow = input<FlexOverflow | undefined>(undefined);
  readonly noWrap = input<boolean>(false);
  readonly shrinkable = input<boolean>(false);
  readonly className = input<string>("");
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaHidden = input<boolean>(false);

  readonly classes = computed<string>(() => {
    const parts: string[] = ["flex", DIRECTION_CLASSES[this.direction()]];

    parts.push(this.noWrap() ? "flex-nowrap" : "flex-wrap");

    const justify = this.justifyContent();
    if (justify !== undefined) {
      parts.push(JUSTIFY_CLASSES[justify]);
    }

    const align = this.alignItems();
    if (align !== undefined) {
      parts.push(ALIGN_CLASSES[align]);
    }

    const gap = this.gap();
    if (gap !== undefined) {
      parts.push(GAP_CLASSES[gap]);
    }

    const flexValue = this.flex();
    if (flexValue !== undefined) {
      parts.push(FLEX_CLASSES[flexValue]);
    }

    const overflow = this.overflow();
    if (overflow !== undefined) {
      parts.push(OVERFLOW_CLASSES[overflow]);
    }

    if (this.shrinkable()) {
      parts.push(this.direction() === "row" ? "min-w-0" : "min-h-0");
    }

    const extra = this.className().trim();
    if (extra) {
      parts.push(extra);
    }

    return parts.filter(Boolean).join(" ");
  });
}

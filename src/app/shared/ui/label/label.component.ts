import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import designConstants, {
  ColorType,
  FontWeightType,
  TypographyType,
} from '@styles/constants';
import { COLOR_CLASSES } from '@styles/types/colors';
import { UiTooltipComponent } from '@shared/ui/tooltip/tooltip.component';
import { TooltipSide } from '@shared/ui/tooltip/tooltip.types';

import { ALIGN_CLASS, FONT_WEIGHT_CLASS, LINE_CLAMP_CLASS } from './label.variants';

/**
 * Etiqueta tipográfica del design system renderizada como `<label>`.
 * Detecta overflow y envuelve el texto en un `UiTooltip` cuando aplica.
 * `font-size`/`line-height` se aplican vía `[style.*]` (tokens en px);
 * el resto son clases Tailwind para soportar light/dark vía `dark:`.
 */
@Component({
  selector: 'UiLabel',
  standalone: true,
  imports: [NgTemplateOutlet, UiTooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './label.component.html',
})
export class UiLabelComponent {
  readonly for = input<string | undefined>(undefined);
  readonly text = input<string | undefined>(undefined);
  readonly type = input<TypographyType>('bodyXs');
  readonly weight = input<FontWeightType | undefined>(undefined);
  readonly color = input<ColorType | undefined>(undefined);
  readonly wrapText = input<boolean>(false);
  readonly wrapMaxLines = input<number | undefined>(undefined);
  readonly availableSpaceOffset = input<number>(0);
  readonly italic = input<boolean>(false);
  readonly refreshOnLoad = input<boolean>(false);
  readonly align = input<'left' | 'right' | 'center' | 'justify' | undefined>(
    undefined,
  );
  readonly className = input<string>('');
  readonly tooltipSide = input<TooltipSide>('bottom');

  readonly containerRef = viewChild<ElementRef<HTMLElement>>('container');
  readonly labelTpl = viewChild<TemplateRef<unknown>>('labelTpl');

  readonly isOverflowing = signal(false);

  private overflowTimeout?: ReturnType<typeof setTimeout>;
  private lastOverflowKey = '';

  readonly resolvedText = computed<string>(() => this.text() ?? '');

  readonly resolvedColorClass = computed<string>(
    () => COLOR_CLASSES[this.color() ?? 'textStrong'],
  );

  readonly resolvedWeightClass = computed<string>(() => {
    const w =
      this.weight() ??
      designConstants.typography.fontWeightByTypographyType[this.type()];
    return FONT_WEIGHT_CLASS[w];
  });

  readonly fontSize = computed<string>(
    () => designConstants.typography.fontSize[this.type()],
  );

  readonly lineHeight = computed<string>(
    () => designConstants.typography.lineHeight[this.type()],
  );

  readonly dynamicLineClamp = computed<string | null>(() => {
    const n = this.wrapMaxLines();
    return this.wrapText() && n && !LINE_CLAMP_CLASS[n] ? n.toString() : null;
  });

  readonly hostClasses = computed<string>(() => {
    const parts: (string | null | undefined)[] = [
      'inline-block max-w-full break-words',
      this.resolvedColorClass(),
      this.resolvedWeightClass(),
      this.className(),
      this.italic() ? 'italic' : null,
      this.align() ? ALIGN_CLASS[this.align()!] : null,
    ];
    if (!this.wrapText()) {
      parts.push('whitespace-nowrap overflow-hidden text-ellipsis');
    } else {
      const n = this.wrapMaxLines();
      if (n && LINE_CLAMP_CLASS[n]) parts.push(LINE_CLAMP_CLASS[n]);
      else if (n) parts.push('overflow-hidden');
    }
    return parts.filter(Boolean).join(' ');
  });

  readonly showTooltip = computed<boolean>(
    () => this.isOverflowing() && (!this.wrapText() || !!this.wrapMaxLines()),
  );

  readonly renderedTpl = computed<TemplateRef<unknown>>(() => this.labelTpl()!);

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.overflowTimeout) clearTimeout(this.overflowTimeout);
    });

    effect(() => {
      this.text();
      this.type();
      this.wrapText();
      this.wrapMaxLines();
      this.availableSpaceOffset();
      this.refreshOnLoad();
      this.scheduleOverflowCheck();
    });
  }

  private scheduleOverflowCheck(): void {
    if (this.overflowTimeout) clearTimeout(this.overflowTimeout);
    this.overflowTimeout = setTimeout(() => this.checkOverflow(), 0);
  }

  private checkOverflow(): void {
    const container = this.containerRef()?.nativeElement;
    if (!container) return;

    const key = `${this.text()}|${this.type()}|${this.wrapText()}|${this.wrapMaxLines() ?? ''}|${this.availableSpaceOffset()}`;
    if (key === this.lastOverflowKey && !this.refreshOnLoad()) return;
    this.lastOverflowKey = key;

    const axis: 'offsetHeight' | 'offsetWidth' = this.wrapText()
      ? 'offsetHeight'
      : 'offsetWidth';
    const size = container[axis] as number;
    const scroll = (
      this.wrapText() ? container.scrollHeight : container.scrollWidth
    ) as number;
    const available = size - this.availableSpaceOffset();

    this.isOverflowing.set(scroll > available);
  }
}

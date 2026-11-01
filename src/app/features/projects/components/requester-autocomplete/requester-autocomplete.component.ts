import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";

import { UiInputComponent } from "@shared/ui/input";

import { filterRequesterSuggestions } from "../../models/subproject";

interface PanelStyle {
  top: string | null;
  bottom: string | null;
  left: string;
  width: string;
  maxHeight: string;
}

const PANEL_GAP_PX = 4;
const PANEL_MAX_HEIGHT_PX = 240;
const PANEL_MIN_SPACE_BELOW_PX = 120;
const VIEWPORT_MARGIN_PX = 8;

@Component({
  selector: "RequesterAutocomplete",
  standalone: true,
  imports: [UiInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./requester-autocomplete.component.html",
  host: { class: "block" },
})
export class RequesterAutocompleteComponent {
  readonly value = input<string>("");
  readonly names = input<readonly string[]>([]);
  readonly placeholder = input<string>("");

  readonly valueChange = output<string>();

  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly inputRef = viewChild.required(UiInputComponent);

  private readonly isOpen = signal(false);
  protected readonly activeIndex = signal(-1);
  protected readonly panelStyle = signal<PanelStyle | null>(null);

  protected readonly suggestions = computed(() =>
    filterRequesterSuggestions(this.names(), this.value()),
  );

  protected readonly isPanelVisible = computed(
    () => this.isOpen() && this.suggestions().length > 0,
  );

  constructor() {
    const onViewportChange = () => {
      if (this.isPanelVisible()) this.repositionPanel();
    };
    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange);
    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
    });
  }

  protected onInput(value: string): void {
    const inputRef = this.inputRef();
    const inputEl = inputRef.inputEl().nativeElement;
    const caret = inputEl.selectionStart;
    const upperValue = value.toUpperCase();
    inputRef.writeValue(upperValue);
    this.valueChange.emit(upperValue);
    afterNextRender(() => inputEl.setSelectionRange(caret, caret), {
      injector: this.injector,
    });
    this.activeIndex.set(-1);
    this.isOpen.set(true);
    this.repositionPanel();
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (!this.isPanelVisible()) return;
    const total = this.suggestions().length;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.activeIndex.update((i) => (i + 1) % total);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.activeIndex.update((i) => (i <= 0 ? total - 1 : i - 1));
        break;
      case "Enter": {
        const active = this.suggestions()[this.activeIndex()];
        if (active) {
          event.preventDefault();
          this.select(active);
        }
        break;
      }
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        this.close();
        break;
    }
  }

  protected select(name: string): void {
    this.valueChange.emit(name.toUpperCase());
    this.close();
  }

  protected close(): void {
    this.isOpen.set(false);
    this.activeIndex.set(-1);
  }

  private repositionPanel(): void {
    const rect = this.hostEl.nativeElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_MARGIN_PX;
    const spaceAbove = rect.top - VIEWPORT_MARGIN_PX;
    const opensBelow =
      spaceBelow >= PANEL_MIN_SPACE_BELOW_PX || spaceBelow >= spaceAbove;
    const available = (opensBelow ? spaceBelow : spaceAbove) - PANEL_GAP_PX;
    this.panelStyle.set({
      top: opensBelow ? `${rect.bottom + PANEL_GAP_PX}px` : null,
      bottom: opensBelow
        ? null
        : `${window.innerHeight - rect.top + PANEL_GAP_PX}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      maxHeight: `${Math.min(PANEL_MAX_HEIGHT_PX, available)}px`,
    });
  }
}

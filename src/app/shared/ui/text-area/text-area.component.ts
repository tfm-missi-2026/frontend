import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { UiFlexComponent } from "@shared/ui/flex/flex.component";
import { UiFormLabelComponent } from "@shared/ui/form-label/form-label.component";
import { UiLabelComponent } from "@shared/ui/label/label.component";
import { ColorType } from "@styles/types/colors";
import { FontWeightType } from "@styles/types/typography";

/**
 * `UiTextArea`
 * ------------
 * Área de texto multilínea del design system.
 *
 * Capacidades:
 *  - Label integrable vía `<UiFormLabel>` (asterisco `*` automático).
 *  - Tooltip junto al label.
 *  - Mensaje de error (cambia el borde a rojo) y `hint` opcional debajo.
 *  - `disabled` / `readOnly` con cambio de color de fondo.
 *  - `maxLength` con contador `N/max` debajo (alineado con el `legend`).
 *  - `rows` configurable.
 *  - `ControlValueAccessor` para integración con `ngModel` / `formControl`.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiTextArea",
  standalone: true,
  imports: [UiFlexComponent, UiFormLabelComponent, UiLabelComponent],
  templateUrl: "./text-area.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiTextAreaComponent),
      multi: true,
    },
  ],
})
export class UiTextAreaComponent implements ControlValueAccessor, OnInit {
  readonly id = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly labelText = input<string | undefined>(undefined);
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly readOnly = input<boolean>(false);
  readonly tooltip = input<string | undefined>(undefined);
  readonly errorMessage = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly placeholder = input<string>("Escribe aquí…");
  readonly rows = input<number>(3);
  readonly maxLength = input<number | undefined>(undefined);
  readonly legend = input<string | undefined>(undefined);
  readonly width = input<string | undefined>(undefined);
  readonly resize = input<"none" | "vertical" | "horizontal" | "both">(
    "vertical",
  );
  readonly className = input<string>("");
  /** Valor controlado. */
  readonly value = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly blurEvt = output<void>();
  readonly focusEvt = output<void>();

  readonly textareaEl =
    viewChild.required<ElementRef<HTMLTextAreaElement>>("textareaEl");

  internalValue = "";
  charCount = 0;

  /** Estado `disabled` que llega desde el `FormControl` (vía `setDisabledState`). */
  private _formDisabled = signal(false);

  private onChangeFn: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.syncFromValue();
  }

  focusTextarea(): void {
    this.textareaEl()?.nativeElement.focus();
  }

  writeValue(value: string | null | undefined): void {
    this.internalValue = value ?? "";
    this.charCount = this.internalValue.length;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.internalValue = target.value;
    this.charCount = target.value.length;
    this.onChangeFn(target.value);
    this.valueChange.emit(target.value);
  }

  onBlurHandler(): void {
    this.onTouchedFn();
    this.blurEvt.emit();
  }

  onFocusHandler(): void {
    this.focusEvt.emit();
  }

  private syncFromValue(): void {
    const v = this.value();
    this.internalValue = v ?? "";
    this.charCount = this.internalValue.length;
  }

  // ---------------------------------------------------------------------------
  // Computed styling
  // ---------------------------------------------------------------------------

  readonly isDisabled = computed<boolean>(
    () => this.disabled() || this._formDisabled(),
  );

  readonly hasError = computed<boolean>(() => !!this.errorMessage());

  readonly outerClasses = computed<string>(() =>
    ["flex flex-col gap-1 w-full font-outfit", this.className()]
      .filter(Boolean)
      .join(" "),
  );

  readonly outerStyles = computed<Record<string, string>>(() => ({
    width: this.width() ?? "",
  }));

  readonly textareaClasses = computed<string>(() =>
    [
      "w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs",
      "bg-transparent text-gray-800 dark:text-white/90",
      "placeholder:text-gray-400 dark:placeholder:text-white/30",
      "focus:outline-hidden focus:ring-3",
      this.isDisabled() || this.readOnly()
        ? "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700 cursor-not-allowed"
        : this.hasError()
          ? "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:border-error-500"
          : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800",
      this.isDisabled() ? "opacity-60" : "",
      `resize-${this.resize()}`,
    ]
      .filter(Boolean)
      .join(" "),
  );

  readonly charCountColor = computed<ColorType>(() => {
    const limit = this.maxLength() ?? Infinity;
    return this.charCount < limit ? "textWeakest" : "textAction";
  });

  readonly charCountText = computed<string>(
    () => `${this.charCount}/${this.maxLength() ?? 0}`,
  );

  readonly charCountWeight: FontWeightType = "regular";
  readonly legendWeight: FontWeightType = "regular";

  readonly footerJustifyContent = computed<string>(() => {
    const hasLegend = !!this.legend();
    const hasMax = !!this.maxLength();
    if (hasLegend && hasMax) return "space-between";
    if (hasLegend) return "flex-start";
    return "flex-end";
  });
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  input,
  OnInit,
  output,
  viewChild,
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";

/**
 * `UiFileInput`
 * -------------
 * Input de archivo del design system.
 *
 * Capacidades:
 *  - `<input type="file">` estilizado con slot "file:" para el botón.
 *  - `multiple`, `accept` y `disabled` configurables.
 *  - `valueChange` emite `File | File[] | null` (según `multiple`).
 *  - `change` emite el `Event` nativo para casos avanzados.
 *  - `ControlValueAccessor` para integración con `ngModel` /
 *    `formControl` (emite `FileList`).
 *  - `fileNamesText` getter accesible para mostrar el nombre del
 *    archivo seleccionado en el placeholder.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiFileInput",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      #inputEl
      type="file"
      [id]="id() || null"
      [name]="name() || null"
      [accept]="accept() || null"
      [multiple]="multiple()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      (change)="onChange($event)"
      data-testid="file-input"
      [class]="inputClasses()"
    />
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiFileInputComponent),
      multi: true,
    },
  ],
})
export class UiFileInputComponent
  implements ControlValueAccessor, OnInit
{
  readonly id = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly accept = input<string | undefined>(undefined);
  readonly multiple = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly buttonText = input<string>("Subir archivo");
  readonly width = input<string | undefined>(undefined);
  readonly className = input<string>("");

  readonly valueChange = output<File | File[] | null>();
  readonly change = output<Event>();

  readonly inputEl =
    viewChild.required<ElementRef<HTMLInputElement>>("inputEl");

  private onChangeFn: (value: FileList | null) => void = () => {};
  private onTouchedFn: () => void = () => {};

  ngOnInit(): void {
    // noop
  }

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) {
      this.onChangeFn(null);
      this.valueChange.emit(null);
    } else if (this.multiple()) {
      const arr = Array.from(files);
      this.onChangeFn(files);
      this.valueChange.emit(arr);
    } else {
      this.onChangeFn(files);
      this.valueChange.emit(files[0] ?? null);
    }
    this.change.emit(event);
  }

  writeValue(value: FileList | null | undefined): void {
    if (!value) return;
    const el = this.inputEl()?.nativeElement;
    if (!el) return;
    // DataTransfer es la única forma soportada de asignar `files`
    // programáticamente a un input.
    const dt = new DataTransfer();
    Array.from(value).forEach((f) => dt.items.add(f));
    el.files = dt.files;
  }

  registerOnChange(fn: (value: FileList | null) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    const el = this.inputEl()?.nativeElement;
    if (el) el.disabled = isDisabled;
  }

  /** Texto derivado del input: nombre del archivo o `buttonText`. */
  fileNamesText(): string {
    const el = this.inputEl()?.nativeElement;
    if (!el || !el.files || el.files.length === 0) return this.buttonText();
    if (this.multiple() && el.files.length > 1) {
      return `${el.files.length} archivos`;
    }
    return el.files[0]?.name ?? this.buttonText();
  }

  readonly inputClasses = (): string =>
    [
      "h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors",
      "file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200",
      "file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700",
      "placeholder:text-gray-400 hover:file:bg-gray-100",
      "focus:outline-hidden focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10",
      "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400",
      "dark:focus:border-brand-800",
      this.disabled() ? "opacity-60 cursor-not-allowed" : "",
      this.className(),
    ]
      .filter(Boolean)
      .join(" ");

  /** Estilo inline opcional para el `width`. */
  readonly styles = (): Record<string, string> => ({
    width: this.width() ?? "",
  });
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { ButtonStyleType, ButtonVariant } from "@shared/ui/button/button.types";
import { getVariantClasses } from "@shared/ui/button/button.utils";

/**
 * Wrapper presentacional que aplica el marco visual (background,
 * border, color) del variant y pinta una progress bar animada
 * mientras corre el `timeout`. El botón interior cede esos estilos
 * (`bg-transparent border-transparent`) para que la barra pueda ser
 * recortada por el `border-radius` del wrapper.
 */
@Component({
  selector: "UiLoadingTimeoutWrapper",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./loading-timeout-wrapper.component.html",
})
export class UiLoadingTimeoutWrapperComponent {
  readonly variant = input<ButtonVariant>("primary");
  readonly styleType = input<ButtonStyleType>("default");
  readonly fullWidth = input<boolean>(false);
  readonly transparent = input<boolean>(false);
  readonly timeout = input<number | undefined>(undefined);
  readonly className = input<string>("");

  readonly containerClasses = computed<string>(() =>
    [
      getVariantClasses(this.variant(), this.styleType(), this.transparent()),
      this.fullWidth() ? "w-full" : "inline-flex",
      "relative overflow-hidden",
      "border border-solid",
      "rounded-lg",
      "cursor-pointer select-none",
      this.className(),
    ]
      .filter(Boolean)
      .join(" "),
  );

  readonly progressClasses = computed<string>(() => {
    const base =
      "absolute inset-0 bg-current opacity-20 origin-left pointer-events-none rounded-[inherit] animate-[ltw-progress-fill_linear_forwards]";
    const timeout = this.timeout();
    return timeout !== undefined ? `${base} duration-[${timeout}ms]` : base;
  });
}

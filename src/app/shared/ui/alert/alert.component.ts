import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { RouterModule } from "@angular/router";

import { UiFlexComponent } from "@shared/ui/flex/flex.component";
import { UiLabelComponent } from "@shared/ui/label/label.component";
import {
  IconErrorComponent,
  IconInfoCircleComponent,
  IconSuccessComponent,
  IconWarningComponent,
} from "@shared/icons";
import { AlertVariant } from "./alert.types";

interface VariantConfig {
  container: string;
  iconClass: string;
}

const VARIANT_CONFIG: Record<AlertVariant, VariantConfig> = {
  success: {
    container:
      "border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15",
    iconClass: "text-success-500",
  },
  error: {
    container:
      "border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15",
    iconClass: "text-error-500",
  },
  warning: {
    container:
      "border-warning-500 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15",
    iconClass: "text-warning-500",
  },
  info: {
    container:
      "border-blue-light-500 bg-blue-light-50 dark:border-blue-light-500/30 dark:bg-blue-light-500/15",
    iconClass: "text-blue-light-500",
  },
};

/**
 * `UiAlert`
 * --------
 * Banner contextual con icono, título, mensaje y link opcional.
 *
 * Variantes: `success` | `error` | `warning` | `info` (default `info`).
 * Cada variante trae su propio icono y paleta semántica.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiAlert",
  standalone: true,
  imports: [
    RouterModule,
    UiFlexComponent,
    UiLabelComponent,
    IconSuccessComponent,
    IconErrorComponent,
    IconWarningComponent,
    IconInfoCircleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./alert.component.html",
})
export class UiAlertComponent {
  /** Variante visual. Define colores e icono por defecto. */
  readonly variant = input<AlertVariant>("info");
  /** Título en negrita (opcional). */
  readonly title = input<string>("");
  /** Mensaje principal. */
  readonly message = input<string>("");
  /** Si `true`, renderiza un `<a [routerLink]>` al final del mensaje. */
  readonly showLink = input<boolean>(false);
  /** Ruta del link (router path, no URL absoluta). */
  readonly linkHref = input<string>("#");
  /** Texto del link. */
  readonly linkText = input<string>("Learn more");
  /** Clases extra para el contenedor. */
  readonly className = input<string>("");

  /** Clases (container + icon) según la variante. */
  readonly config = computed<VariantConfig>(
    () => VARIANT_CONFIG[this.variant()],
  );

  /** Clases del contenedor raíz. */
  readonly containerClasses = computed<string>(() =>
    ["rounded-xl border p-4", this.config().container, this.className()]
      .filter(Boolean)
      .join(" "),
  );

  /** Clases del slot del icono. */
  readonly iconClasses = computed<string>(() =>
    `-mt-0.5 ${this.config().iconClass}`.trim(),
  );
}

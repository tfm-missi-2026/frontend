import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { UiFlexComponent } from "@shared/ui/flex/flex.component";
import { UiLabelComponent } from "@shared/ui/label/label.component";
import { UiSurfaceComponent } from "@shared/ui/surface/surface.component";
import { UiIconComponent } from "@shared/ui/icon/icon.component";
import { UiLinkComponent } from "@shared/ui/link/link.component";
import {
  IconErrorComponent,
  IconInfoCircleComponent,
  IconSuccessComponent,
  IconWarningComponent,
} from "@shared/icons";
import { AlertVariant } from "./alert.types";

/**
 * `UiAlert`
 * --------
 * Banner contextual con icono, título, mensaje y link opcional.
 *
 * Variantes: `success` | `error` | `warning` | `info` (default `info`).
 * Cada variante trae su propio icono y paleta semántica.
 *
 * Construido sobre `UiSurface` (contenedor) + `UiIcon` (slot del
 * icono) + `UiLink` (link opcional) — sin `<div>` ni CSS inline.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiAlert",
  standalone: true,
  imports: [
    UiSurfaceComponent,
    UiIconComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiLinkComponent,
    IconSuccessComponent,
    IconErrorComponent,
    IconWarningComponent,
    IconInfoCircleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./alert.component.html",
})
export class UiAlertComponent {
  /** Variante visual. Define color de fondo, borde e icono. */
  readonly variant = input<AlertVariant>("info");
  /** Título en negrita (opcional). */
  readonly title = input<string>("");
  /** Mensaje principal. */
  readonly message = input<string>("");
  /** Si `true`, renderiza un link al final del mensaje. */
  readonly showLink = input<boolean>(false);
  /** Ruta del link (router path). */
  readonly linkHref = input<string>("#");
  /** Texto del link. */
  readonly linkText = input<string>("Learn more");
  /** Clases extra aplicadas a la superficie. */
  readonly className = input<string>("");

  /** Mapea la variante del alert a la variante semántica de `UiSurface`. */
  readonly surfaceVariant = computed<"success" | "error" | "warning" | "info">(
    () => this.variant(),
  );

  /** Mapea la variante del alert a la variante semántica de `UiIcon`. */
  readonly iconVariant = computed<"success" | "error" | "warning" | "info">(
    () => this.variant(),
  );
}

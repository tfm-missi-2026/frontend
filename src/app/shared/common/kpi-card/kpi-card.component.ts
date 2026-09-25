import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiLinkComponent } from "@shared/ui/link";
import { UiSurfaceComponent } from "@shared/ui/surface";

@Component({
  selector: "CommonKpiCard",
  standalone: true,
  imports: [UiFlexComponent, UiLabelComponent, UiLinkComponent, UiSurfaceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // `display: contents`: dentro de un UiGrid la celda debe estirar al
  // UiSurface (grid item), no al host. Sin esto cada tarjeta mide su propio
  // contenido (min-h-37) y quedan con alturas distintas cuando alguna tiene
  // contenido extra (p. ej. la barra de progreso).
  host: { class: "contents" },
  templateUrl: "./kpi-card.component.html",
})
export class CommonKpiCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number | string>();
  readonly valueSuffix = input<string>("");
  readonly sub = input<string>("");
  readonly alert = input<boolean>(false);
  readonly progressPct = input<number | null>(null);
  readonly linkLabel = input<string>("");
  /** Ruta interna del enlace (`routerLink`). Con esto el enlace es un `<a>`
   *  real: solo el texto navega, no la card completa. */
  readonly linkTo = input<string | undefined>(undefined);

  readonly linkClick = output<void>();

  protected readonly displayValue = computed<string>(() =>
    String(this.value()),
  );

  protected readonly showProgressBar = computed<boolean>(
    () => this.progressPct() !== null,
  );

  protected readonly minibarFillPct = computed<number>(() => {
    const pct = this.progressPct();
    if (pct === null) return 0;
    return Math.min(pct, 99);
  });

  protected onLinkClick(): void {
    if (this.linkLabel()) this.linkClick.emit();
  }
}

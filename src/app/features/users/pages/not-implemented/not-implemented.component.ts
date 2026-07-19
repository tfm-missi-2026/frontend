import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";

import { IconArrowLeftComponent } from "@shared/icons";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";

/**
 * `NotImplementedPage`
 * --------------------
 * Stub compartido para rutas que aún no tienen pantalla. Se reutiliza
 * para Roles, Catálogo, Módulos y Configuración. El sidebar las marca
 * con el badge "pendiente"; si el usuario navega a la URL igual,
 * aterriza aquí con un mensaje claro y un CTA para volver al inicio.
 */
@Component({
  selector: "NotImplementedPage",
  standalone: true,
  imports: [
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./not-implemented.component.html",
})
export class NotImplementedPageComponent {
  private readonly router = inject(Router);
  protected readonly homeIcon = IconArrowLeftComponent;

  protected goHome(): void {
    void this.router.navigateByUrl("/app/administracion/usuarios");
  }
}

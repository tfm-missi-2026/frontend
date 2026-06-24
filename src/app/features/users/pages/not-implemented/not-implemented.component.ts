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
  template: `
    <UiFlex
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap="16px"
      className="min-h-96 px-6 py-20 text-center"
    >
      <UiHeader [level]="2" text="Funcionalidad pendiente" />
      <UiLabel
        type="bodyS"
        color="textWeak"
        text="Esta sección aún no está implementada en el sistema."
      />
      <UiButton
        variant="secondary"
        [LeftIcon]="homeIcon"
        labelText="Volver al inicio"
        (click)="goHome()"
      />
    </UiFlex>
  `,
})
export class NotImplementedPageComponent {
  private readonly router = inject(Router);
  protected readonly homeIcon = IconArrowLeftComponent;

  protected goHome(): void {
    void this.router.navigateByUrl("/app/administracion/usuarios");
  }
}

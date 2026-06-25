import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UiButtonComponent } from "@shared/ui/button";
import { UiCardComponent } from "@shared/ui/card";
import { UiFlexComponent } from "@shared/ui/flex";

/**
 * `SidebarLayoutWidgetComponent`
 * ------------------------------
 * CTA inferior del sidebar. Muestra una `UiCard` con el pitch del
 * sistema y un `UiButton` (renderizado como `<a>` externo vía `asLink`)
 * hacia la documentación del proyecto.
 *
 * Standalone + `OnPush`. Sin inputs/outputs: el contenido es estático.
 */
@Component({
  selector: "SidebarLayoutWidget",
  standalone: true,
  imports: [UiButtonComponent, UiCardComponent, UiFlexComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiCard
      padding="md"
      variant="default"
      title="SPSRT"
      description="Sistema de Planificación y Seguimiento de Recursos Técnicos."
      className="mb-10 w-full max-w-60 mx-auto text-center bg-gray-50 dark:bg-white/3"
    >
      <UiFlex justify="center">
        <UiButton
          variant="primary"
          [asLink]="true"
          [linkProps]="{
            href: 'https://github.com/',
            target: '_blank',
            rel: 'nofollow',
          }"
          labelText="Ver documentación"
          className="w-full"
        />
      </UiFlex>
    </UiCard>
  `,
})
export class SidebarLayoutWidgetComponent {}

import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';

import {
  IconAttachComponent,
  IconHamburgerComponent,
  IconPaperPlaneComponent,
} from '@shared/icons';
import { UiButtonComponent } from '@shared/ui/button';
import { UiFlexComponent } from '@shared/ui/flex';
import { UiHeaderComponent } from '@shared/ui/header';
import { UiIconButtonComponent } from '@shared/ui/icon-button';
import { UiTextAreaComponent } from '@shared/ui/text-area';

/**
 * `GeneratorLayoutComponent`
 * -------------------------
 * Layout específico para rutas de generator (chat + prompt). Incluye
 * un header con título "Chats History" y un toggle de sidebar, y un
 * contenedor para `<ng-content>` con un prompt fijo abajo (textarea
 * + botón "Attach" + botón "Send") que queda superpuesto al contenido.
 *
 * Standalone + `OnPush` + signal API. El estado del sidebar local se
 * gestiona con un `signal()` propio (no comparte `SidebarService`
 * porque este layout es independiente).
 */
@Component({
  selector: 'app-generator-layout',
  standalone: true,
  imports: [
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiIconButtonComponent,
    UiTextAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './generator-layout.component.html',
})
export class GeneratorLayoutComponent {
  protected readonly sidebarOpen = signal(true);

  protected readonly hamburgerIcon = IconHamburgerComponent;
  protected readonly attachIcon = IconAttachComponent;
  protected readonly sendIcon = IconPaperPlaneComponent;

  protected toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }
}
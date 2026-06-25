import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { SidebarService } from '../../services/sidebar.service';

/**
 * `BackdropComponent`
 * ------------------
 * Overlay oscuro que se muestra detrás del sidebar cuando está abierto
 * en mobile. Al hacer click cierra el sidebar.
 *
 * Es standalone + `OnPush`. Consume `SidebarService.isMobileOpen$`
 * vía `toSignal` para integrarse con el patrón signal-based del resto
 * del DS sin migrar el servicio (que sigue exponiendo RxJS).
 */
@Component({
  selector: 'app-backdrop',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './backdrop.component.html',
})
export class BackdropComponent {
  private readonly sidebarService = inject(SidebarService);

  protected readonly isMobileOpen = toSignal(this.sidebarService.isMobileOpen$, {
    initialValue: false,
  });

  protected closeSidebar(): void {
    this.sidebarService.setMobileOpen(false);
  }
}
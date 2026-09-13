import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";

import { AuthService } from "@core/auth/auth.service";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

interface AccountField {
  label: string;
  value: string;
}

@Component({
  selector: "AccountSettingsPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./account-settings.component.html",
})
export class AccountSettingsPageComponent {
  private readonly auth = inject(AuthService);

  protected readonly breadcrumbItems = [
    { label: "Mi cuenta" },
    { label: "Configuración" },
  ];

  protected readonly fields = computed<AccountField[]>(() => {
    const usuario = this.auth.usuario();
    return [
      { label: "Nombre", value: usuario?.nombreCompleto ?? "—" },
      { label: "Correo electrónico", value: usuario?.email ?? "—" },
      { label: "Rol", value: usuario?.rol?.nombre ?? "—" },
      { label: "Descripción del rol", value: usuario?.rol?.descripcion ?? "—" },
    ];
  });
}

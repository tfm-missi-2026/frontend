import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { RouterLink } from "@angular/router";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiImageComponent } from "@shared/ui/image";

/**
 * `SidebarLayoutLogoComponent`
 * ----------------------------
 * Logo del sidebar. Renderiza el lockup completo cuando el sidebar está
 * expandido (con un par `<UiImage>` light/dark que se alternan vía
 * `dark:`) o el ícono cuadrado cuando está colapsado.
 *
 * Standalone + `OnPush` + signal API. La lógica de cuándo mostrar
 * cada variante viene del padre (`isExpandedOrHovered`).
 */
@Component({
  selector: "SidebarLayoutLogo",
  standalone: true,
  imports: [RouterLink, UiFlexComponent, UiImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiFlex
      direction="row"
      alignItems="center"
      [justifyContent]="isExpandedOrHovered() ? 'flex-start' : 'center'"
      className="py-8"
    >
      <a routerLink="/" [attr.aria-label]="'Inicio'">
        @if (isExpandedOrHovered()) {
          <UiImage
            src="/images/logo/logo.svg"
            alt="Logo SPSRT"
            width="w-[150px]"
            height="h-10"
            rounded="none"
            [bordered]="false"
            className="dark:hidden"
          />
          <UiImage
            src="/images/logo/logo-dark.svg"
            alt="Logo SPSRT"
            width="w-[150px]"
            height="h-10"
            rounded="none"
            [bordered]="false"
            className="hidden dark:block"
          />
        } @else {
          <UiImage
            src="/images/logo/logo-icon.svg"
            alt="Logo SPSRT"
            width="w-8"
            height="h-8"
            rounded="none"
            [bordered]="false"
          />
        }
      </a>
    </UiFlex>
  `,
})
export class SidebarLayoutLogoComponent {
  /** `true` cuando el sidebar está expandido, hover-expandido o abierto en mobile. */
  readonly isExpandedOrHovered = input<boolean>(true);
}
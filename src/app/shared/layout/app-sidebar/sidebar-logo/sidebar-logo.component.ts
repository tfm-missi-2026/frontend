import {
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";
import { RouterLink } from "@angular/router";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiImageComponent } from "@shared/ui/image";
import { UiLabelComponent } from "@shared/ui/label";

/**
 * `SidebarLayoutLogoComponent`
 * ----------------------------
 * Logo del sidebar. Renderiza el ícono (`logo-icon.svg`) siempre, más
 * el texto "SPSRT" cuando el sidebar está expandido u hover-expandido.
 *
 * Se compone con piezas separadas (ícono + `<UiLabel>`) en lugar de
 * depender del lockup monolítico `logo.svg`, que puede renderizarse
 * con artefactos visuales según el viewer.
 *
 * Standalone + `OnPush` + signal API.
 */
@Component({
  selector: "SidebarLayoutLogo",
  standalone: true,
  imports: [RouterLink, UiFlexComponent, UiImageComponent, UiLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiFlex
      direction="row"
      alignItems="center"
      [justifyContent]="isExpandedOrHovered() ? 'start' : 'center'"
      className="py-6 gap-3"
    >
      <a
        routerLink="/"
        class="flex items-center gap-3 min-w-0"
        [attr.aria-label]="'Inicio'"
      >
        <UiImage
          src="/images/logo/logo-icon.svg"
          alt="Logo SPSRT"
          width="w-8"
          height="h-8"
          rounded="none"
          [bordered]="false"
          className="dark:hidden shrink-0"
        />
        <UiImage
          src="/images/logo/logo-icon.svg"
          alt="Logo SPSRT"
          width="w-8"
          height="h-8"
          rounded="none"
          [bordered]="false"
          className="hidden dark:block shrink-0"
        />
        @if (isExpandedOrHovered()) {
          <UiLabel
            type="HeadingXl"
            weight="bold"
            color="textStrong"
            className="truncate"
          >
            SPSRT
          </UiLabel>
        }
      </a>
    </UiFlex>
  `,
})
export class SidebarLayoutLogoComponent {
  /** `true` cuando el sidebar está expandido, hover-expandido o abierto en mobile. */
  readonly isExpandedOrHovered = input<boolean>(true);
}

import { ChangeDetectionStrategy, Component } from "@angular/core";

/**
 * Componente placeholder para la ruta raiz de /app. Nunca se renderiza:
 * `landingGuard` redirige siempre a la pagina de inicio del rol antes de
 * activar la ruta.
 */
@Component({
  selector: "LandingRedirect",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./landing-redirect.component.html",
})
export class LandingRedirectComponent {}
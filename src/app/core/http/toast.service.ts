import { Injectable, inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";

import { ApiProblem } from "./error.interceptor";

// Wrapper sobre ngx-toastr con el shape del proyecto. Cada tipo de
// problema mapea a una clase de Bootstrap (success/error/warning/info)
// consistente con el design system.
@Injectable({ providedIn: "root" })
export class ToastService {
  private readonly toastr = inject(ToastrService);

  showProblem(problem: ApiProblem): void {
    const message = this.formatDetail(problem);
    switch (problem.code) {
      case "VALIDACION_FALLIDA":
        this.toastr.warning(message, "Datos inválidos", { timeOut: 6000 });
        return;
      case "CREDENCIALES_INVALIDAS":
        this.toastr.error(message, "Credenciales inválidas");
        return;
      case "USUARIO_DESHABILITADO":
        this.toastr.warning(message, "Usuario deshabilitado");
        return;
      case "ACCESO_DENEGADO":
        this.toastr.error(message, "Acceso denegado");
        return;
      case "RECURSO_NO_ENCONTRADO":
        this.toastr.info(message, "No encontrado", { timeOut: 4000 });
        return;
      case "CONFLICTO_NEGOCIO":
        this.toastr.warning(message, "Conflicto", { timeOut: 5000 });
        return;
      case "CONFLICTO_INTEGRIDAD":
        this.toastr.warning(message, "Conflicto de integridad", {
          timeOut: 5000,
        });
        return;
      case "ERROR_INTERNO":
      default:
        this.toastr.error(message, "Error interno", { timeOut: 8000 });
        return;
    }
  }

  success(message: string, title?: string): void {
    this.toastr.success(message, title);
  }

  error(message: string, title?: string): void {
    this.toastr.error(message, title);
  }

  info(message: string, title?: string): void {
    this.toastr.info(message, title);
  }

  warning(message: string, title?: string): void {
    this.toastr.warning(message, title);
  }

  private formatDetail(problem: ApiProblem): string {
    if (problem.errors && problem.errors.length > 0) {
      const items = problem.errors
        .map((e) => `${e.campo}: ${e.mensaje}`)
        .join("\n");
      return `${problem.detail || "Datos inválidos"}\n${items}`;
    }
    return problem.detail || "Error inesperado";
  }
}

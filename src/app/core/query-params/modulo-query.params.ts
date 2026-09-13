import { BaseQueryParams } from "./base-query.params";

export class ModuloQueryParams extends BaseQueryParams {
  seccion: string | null = null;
  estado: 0 | 1 | null = null;

  override reset(): this {
    super.reset();
    this.seccion = null;
    this.estado = null;
    return this;
  }
}

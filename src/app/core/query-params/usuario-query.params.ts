import { BaseQueryParams } from "./base-query.params";

export class UsuarioQueryParams extends BaseQueryParams {
  rolCodigo: string | null = null;
  estado: 0 | 1 | null = null;

  override reset(): this {
    super.reset();
    this.rolCodigo = null;
    this.estado = null;
    return this;
  }
}

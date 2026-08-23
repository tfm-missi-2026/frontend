import { BaseQueryParams } from "./base-query.params";

export class RolQueryParams extends BaseQueryParams {
  sistema: boolean | null = null;
  estado: number | null = null;

  override reset(): this {
    super.reset();
    this.sistema = null;
    this.estado = null;
    return this;
  }
}

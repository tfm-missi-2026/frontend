import { BaseQueryParams } from "./base-query.params";

export class CatalogoQueryParams extends BaseQueryParams {
  grupo: string | null = null;
  estado: 0 | 1 | null = null;

  override reset(): this {
    super.reset();
    this.grupo = null;
    this.estado = null;
    return this;
  }
}

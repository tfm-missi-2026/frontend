import { BaseQueryParams } from "./base-query.params";

export class RolQueryParams extends BaseQueryParams {
  sistema: boolean | null = null;
  estado: number | null = null;

  override reset(): void {
    super.reset();
    this.sistema = null;
    this.estado = null;
  }
}
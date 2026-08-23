import { HttpParams } from "@angular/common/http";

/**
 * Mirror frontend de `pe.unir.tfm.srp.administracion.dto.request.BaseQueryParams`.
 *
 * Sustrato comun de cualquier listado paginado expuesto por el backend.
 * Las subclases ({@link ModuloQueryParams}, {@link RolQueryParams},
 * {@link UsuarioQueryParams}) solo agregan los filtros de dominio
 * especificos y extienden el `reset()` para limpiarlos.
 *
 * Pensado para vivir como signal en un servicio singleton y ser la
 * UNICA fuente de verdad de filtros/orden/pagina/busqueda:
 *
 * ```ts
 * readonly query = signal(new UsuarioQueryParams({ pageSize: 10 }));
 * ```
 *
 * El `refreshToken` es un campo interno (no se envia al backend; se
 * excluye en {@link toHttpParams}) que las mutaciones del servicio pueden
 * incrementar via {@link bumpRefresh} para forzar un refetch en el
 * UiTable sin alterar los filtros visibles al usuario.
 */
export class BaseQueryParams {
  page: number = 1;
  pageSize: number = 10;
  search: string = "";
  sortBy: string | null = null;
  sortDir: "asc" | "desc" = "asc";

  /**
   * Counter interno que las mutaciones del servicio incrementan para
   * forzar refetch del UiTable sin tocar filtros visibles. NO se envia
   * al backend (omitido en {@link toHttpParams}).
   */
  refreshToken: number = 0;

  constructor(init?: Record<string, unknown>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  toHttpParams(): HttpParams {
    let p = new HttpParams();
    const excluded = new Set(["refreshToken"]);
    for (const [key, value] of Object.entries(this)) {
      if (excluded.has(key)) continue;
      if (value === null || value === undefined || value === "") continue;
      p = p.set(key, String(value));
    }
    return p;
  }

  setPage(page: number): this {
    this.page = Math.max(1, page);
    return this;
  }

  setPageSize(pageSize: number): this {
    this.pageSize = pageSize;
    this.page = 1;
    return this;
  }

  setSearch(search: string): this {
    this.search = search ?? "";
    this.page = 1;
    return this;
  }

  setSort(by: string | null, dir: "asc" | "desc" = "asc"): this {
    this.sortBy = by;
    this.sortDir = by ? dir : "asc";
    this.page = 1;
    return this;
  }

  nextPage(): this {
    this.page += 1;
    return this;
  }

  prevPage(): this {
    if (this.page > 1) this.page -= 1;
    return this;
  }

  /**
   * Incrementa el `refreshToken` interno para que un UiTable reactivo
   * vuelva a ejecutar su `fetchData`. No altera ningun filtro visible.
   */
  bumpRefresh(): this {
    this.refreshToken += 1;
    return this;
  }

  /**
   * Restablece los campos base a sus defaults. Las subclases sobrescriben
   * este metodo llamando `super.reset()` y limpiando tambien sus campos
   * especificos.
   */
  reset(): this {
    this.page = 1;
    this.pageSize = 10;
    this.search = "";
    this.sortBy = null;
    this.sortDir = "asc";
    this.refreshToken = 0;
    return this;
  }
}

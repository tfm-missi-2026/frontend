import { HttpParams } from "@angular/common/http";

export class BaseQueryParams {
  page: number = 1;
  pageSize: number = 10;
  search: string = "";
  sortBy: string | null = null;
  sortDir: "asc" | "desc" = "asc";

  constructor(init?: Record<string, unknown>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  toHttpParams(): HttpParams {
    let p = new HttpParams();
    for (const [key, value] of Object.entries(this)) {
      if (value === null || value === undefined || value === "") continue;
      p = p.set(key, String(value));
    }
    return p;
  }

  nextPage(): void {
    this.page += 1;
  }

  reset(): void {
    this.search = "";
    this.sortBy = null;
    this.sortDir = "asc";
  }
}
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  signal,
} from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BaseQueryParams } from "@core/query-params";

import { UiTableComponent } from "./table.component";
import { TableColumn } from "./table.types";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
}

const SAMPLE_DATA: User[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@math.io", role: "admin" },
  { id: 2, name: "Alan Turing", email: "alan@cs.io", role: "member" },
  { id: 3, name: "Grace Hopper", email: "grace@navy.io", role: "admin" },
];

const SAMPLE_COLUMNS: TableColumn<User>[] = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
];

class TestQuery extends BaseQueryParams {}

function applyInputs<T>(
  fixture: ComponentFixture<T>,
  opts: Record<string, unknown>,
): void {
  const ref = fixture.componentRef as unknown as {
    setInput: (name: string, value: unknown) => void;
  };
  for (const [k, v] of Object.entries(opts)) {
    ref.setInput(k, v);
  }
}

describe("Table", () => {
  let fixture: ComponentFixture<UiTableComponent>;
  let component: UiTableComponent;
  let queryValue: () => TestQuery;
  let queryEmitSpy: jasmine.Spy;

  beforeEach(async () => {
    const querySignal = signal(new TestQuery());
    queryValue = () => querySignal();

    await TestBed.configureTestingModule({
      imports: [UiTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTableComponent);
    component = fixture.componentInstance;
    queryEmitSpy = jasmine.createSpy("queryChange");
    component.queryChange.subscribe(queryEmitSpy);
    fixture.componentRef.setInput("query", querySignal());
    applyInputs(fixture, {
      columns: SAMPLE_COLUMNS,
      data: SAMPLE_DATA,
    });
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("renders one row per data item by default", () => {
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll("tbody tr");
    expect(rows.length).toBe(3);
  });

  it("renders the empty state when data is empty", () => {
    fixture.componentRef.setInput("data", []);
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector("tbody tr td[colspan]");
    expect(empty).toBeTruthy();
    expect(empty.textContent.trim()).toContain("No results found");
  });

  describe("queryChange emission (sort/search/page)", () => {
    it("onSearchInput emits a new query with setSearch and page=1", () => {
      component.onSearchInput("ada");
      expect(queryEmitSpy).toHaveBeenCalledTimes(1);
      const emitted = queryEmitSpy.calls.mostRecent().args[0] as TestQuery;
      expect(emitted.search).toBe("ada");
      expect(emitted.page).toBe(1);
    });

    it("does NOT mutate the input query in-place", () => {
      const before = queryValue();
      component.onSearchInput("ada");
      const after = queryValue();
      expect(after).toBe(before);
      expect(before.search).toBe("");
    });

    it("onSortChange cycles asc -> desc -> null", () => {
      component.onSortChange({ key: "name", direction: "asc" });
      expect((queryEmitSpy.calls.mostRecent().args[0] as TestQuery).sortBy).toBe(
        "name",
      );

      component.onSortChange({ key: "name", direction: "desc" });
      expect((queryEmitSpy.calls.mostRecent().args[0] as TestQuery).sortDir).toBe(
        "desc",
      );

      component.onSortChange({ key: "name", direction: null });
      const cleared = queryEmitSpy.calls.mostRecent().args[0] as TestQuery;
      expect(cleared.sortBy).toBeNull();
      expect(cleared.sortDir).toBe("asc");
      expect(cleared.page).toBe(1);
    });

    it("onPrevPage / onNextPage mutate the page", () => {
      component.onPrevPage();
      // page=1, emit permite q.page avanzar a 0 -> setPrevPage lo mantiene en 1
      expect((queryEmitSpy.calls.mostRecent().args[0] as TestQuery).page).toBe(1);

      component.onNextPage();
      expect((queryEmitSpy.calls.mostRecent().args[0] as TestQuery).page).toBe(2);
    });

    it("onPageSizeSelect changes pageSize and resets page to 1", () => {
      component.onPageSizeSelect(25);
      const emitted = queryEmitSpy.calls.mostRecent().args[0] as TestQuery;
      expect(emitted.pageSize).toBe(25);
      expect(emitted.page).toBe(1);
    });
  });

  describe("selection", () => {
    it("toggles a single row in and out of selectedRows", () => {
      const row = SAMPLE_DATA[0];
      component.onRowToggle(row, true);
      expect(component["selectedRows"]()).toContain(row);
      component.onRowToggle(row, false);
      expect(component["selectedRows"]()).not.toContain(row);
    });

    it("emits rowSelect with rows and keys", () => {
      const spy = spyOn(component.rowSelect, "emit");
      component.onRowToggle(SAMPLE_DATA[0], true);
      expect(spy).toHaveBeenCalledWith({
        rows: [SAMPLE_DATA[0]],
        keys: [1],
      });
    });
  });

  describe("pagination", () => {
    it("computes totalPages from pageCount input", () => {
      fixture.componentRef.setInput("paginated", true);
      fixture.componentRef.setInput("pageCount", 5);
      fixture.detectChanges();
      expect(component["totalPages"]()).toBe(5);
    });

    it("computes totalPages from total + pageSize when no pageCount", () => {
      fixture.componentRef.setInput("paginated", true);
      fixture.componentRef.setInput("total", 100);
      const q = queryValue();
      q.setPageSize(25);
      fixture.componentRef.setInput("query", q);
      fixture.detectChanges();
      expect(component["totalPages"]()).toBe(4);
    });
  });

  describe("cell rendering", () => {
    it("getCellValue returns string for known key", () => {
      expect(component["getCellValue"](SAMPLE_DATA[0], "name")).toBe(
        "Ada Lovelace",
      );
    });

    it('getCellValue returns "" for missing key', () => {
      expect(component["getCellValue"](SAMPLE_DATA[0], "missing")).toBe("");
    });

    it("does not render uppercase class on header th", () => {
      fixture.detectChanges();
      const th = fixture.nativeElement.querySelector("thead th");
      expect(th.className).not.toContain("uppercase");
    });
  });
});

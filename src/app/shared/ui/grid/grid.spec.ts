import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiGridComponent } from "./grid";
import { GridBreakpoint, GridColumns } from "./grid.types";

@Component({
  standalone: true,
  imports: [UiGridComponent],
  template: `
    <UiGrid
      [columns]="columns"
      [breakpoint]="breakpoint"
      [gap]="gap"
      [ariaLabel]="ariaLabel"
      [className]="className"
    >
      <div data-testid="child-1" class="bg-gray-200">A</div>
      <div data-testid="child-2" class="bg-gray-200">B</div>
      <div data-testid="child-3" class="bg-gray-200">C</div>
    </UiGrid>
  `,
})
class GridHostComponent {
  columns: GridColumns = 2;
  breakpoint: GridBreakpoint = "sm";
  gap = "gap-5";
  ariaLabel = "Grid";
  className = "";

  @ViewChild(UiGridComponent) grid!: UiGridComponent;
}

describe("UiGrid", () => {
  let fixture: ComponentFixture<GridHostComponent>;
  let host: GridHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GridHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function container(): HTMLElement {
    return fixture.nativeElement.querySelector(
      '[data-testid="grid"]',
    ) as HTMLElement;
  }

  function children(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll(
      '[data-testid="grid"] [data-testid^="child-"]',
    );
  }

  it("should create", () => {
    expect(host.grid).toBeTruthy();
  });

  it("projects ng-content children", () => {
    expect(children().length).toBe(3);
  });

  it("applies the matching Tailwind grid class per breakpoint+columns", () => {
    const cases: Array<[GridBreakpoint, GridColumns, string]> = [
      ["sm", 2, "sm:grid-cols-2"],
      ["sm", 3, "sm:grid-cols-3"],
      ["md", 4, "md:grid-cols-4"],
      ["lg", 5, "lg:grid-cols-5"],
      ["xl", 6, "xl:grid-cols-6"],
      ["2xl", 3, "2xl:grid-cols-3"],
    ];
    for (const [bp, cols, expected] of cases) {
      host.breakpoint = bp;
      host.columns = cols;
      fixture.detectChanges();
      expect(host.grid.containerClasses()).toContain(expected);
    }
  });

  it("always includes grid-cols-1 for mobile", () => {
    expect(host.grid.containerClasses()).toContain("grid-cols-1");
  });

  it("uses gap-5 by default", () => {
    expect(host.grid.containerClasses()).toContain("gap-5");
  });

  it("appends a custom gap", () => {
    host.gap = "gap-8";
    fixture.detectChanges();
    expect(host.grid.containerClasses()).toContain("gap-8");
  });

  it("appends extra className to the container", () => {
    host.className = "max-w-4xl";
    fixture.detectChanges();
    expect(host.grid.containerClasses()).toContain("max-w-4xl");
  });

  it("exposes role=list on the container", () => {
    expect(container().getAttribute("role")).toBe("list");
  });

  it("forwards ariaLabel to the container", () => {
    host.ariaLabel = "Galería de productos";
    fixture.detectChanges();
    expect(container().getAttribute("aria-label")).toBe(
      "Galería de productos",
    );
  });
});

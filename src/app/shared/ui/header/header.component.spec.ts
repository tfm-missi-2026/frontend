import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiHeaderComponent } from "./header.component";

describe("UiHeader", () => {
  let fixture: ComponentFixture<UiHeaderComponent>;
  let component: UiHeaderComponent;
  let native: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiHeaderComponent);
    component = fixture.componentInstance;
    native = fixture.nativeElement;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("renders an h1 by default", () => {
    expect(native.querySelector("h1")).toBeTruthy();
  });

  it("renders the matching tag for each level", () => {
    for (const level of [1, 2, 3, 4, 5] as const) {
      fixture.componentRef.setInput("level", level);
      fixture.detectChanges();
      expect(native.querySelector(`h${level}`)).toBeTruthy();
    }
  });

  it("renders the `as` override tag instead of the level tag", () => {
    fixture.componentRef.setInput("level", 3);
    fixture.componentRef.setInput("as", 2);
    fixture.detectChanges();
    expect(native.querySelector("h2")).toBeTruthy();
    expect(native.querySelector("h3")).toBeNull();
  });

  it("prefers `text` input over projected content", () => {
    fixture.componentRef.setInput("level", 1);
    fixture.componentRef.setInput("text", "From input");
    fixture.detectChanges();
    expect(native.textContent).toContain("From input");
  });

  it("falls back to ng-content when `text` is empty", () => {
    fixture.componentRef.setInput("level", 1);
    fixture.componentRef.setInput("text", undefined);
    fixture.detectChanges();
    expect(native.textContent).toBe("");
  });

  it("exposes the id attribute when provided", () => {
    fixture.componentRef.setInput("level", 1);
    fixture.componentRef.setInput("id", "main-title");
    fixture.detectChanges();
    const h1 = native.querySelector("h1");
    expect(h1?.id).toBe("main-title");
  });

  it("does not emit an id attribute when id is empty", () => {
    fixture.componentRef.setInput("level", 1);
    fixture.detectChanges();
    const h1 = native.querySelector("h1");
    expect(h1?.getAttribute("id")).toBeNull();
  });

  it("resolves weight to the typography default when not provided", () => {
    fixture.componentRef.setInput("level", 1);
    fixture.detectChanges();
    expect(component.resolvedWeight()).toBe("700");
  });

  it("uses the explicit weight when provided", () => {
    fixture.componentRef.setInput("level", 1);
    fixture.componentRef.setInput("weight", "regular");
    fixture.detectChanges();
    expect(component.resolvedWeight()).toBe("400");
  });

  it("applies className plus the base font", () => {
    fixture.componentRef.setInput("level", 1);
    fixture.componentRef.setInput("className", "text-brand-500");
    fixture.detectChanges();
    const h1 = native.querySelector("h1");
    expect(h1?.className).toContain("font-outfit");
    expect(h1?.className).toContain("text-brand-500");
  });

  it("resolves the typography type from the level", () => {
    fixture.componentRef.setInput("level", 3);
    fixture.detectChanges();
    expect(component.resolvedTypography()).toBe("HeadingL");
    expect(component.resolvedFontSize()).toBe("18px");
    expect(component.resolvedLineHeight()).toBe("28px");
  });
});

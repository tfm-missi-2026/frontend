import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiFieldValueComponent } from "./field-value";

describe("UiFieldValue", () => {
  let fixture: ComponentFixture<UiFieldValueComponent>;
  let native: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiFieldValueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiFieldValueComponent);
    native = fixture.nativeElement;
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("renders nothing when both value and placeholder are empty", () => {
    expect(native.children.length).toBe(0);
  });

  it("renders the value in primary text color when set", async () => {
    fixture.componentRef.setInput("value", "Angular");
    await fixture.whenStable();
    const span = native.querySelector("span");
    expect(span?.textContent).toBe("Angular");
    expect(span?.className).toContain("text-gray-800");
    expect(span?.className).not.toContain("text-gray-400");
  });

  it("renders the placeholder in muted color when value is empty", async () => {
    fixture.componentRef.setInput("placeholder", "Seleccionar");
    await fixture.whenStable();
    const span = native.querySelector("span");
    expect(span?.textContent).toBe("Seleccionar");
    expect(span?.className).toContain("text-gray-400");
  });

  it("prefers value over placeholder", async () => {
    fixture.componentRef.setInput("value", "Vue");
    fixture.componentRef.setInput("placeholder", "Seleccionar");
    await fixture.whenStable();
    const span = native.querySelector("span");
    expect(span?.textContent).toBe("Vue");
    expect(span?.className).toContain("text-gray-800");
  });

  it("appends valueClassName only to the value span", async () => {
    fixture.componentRef.setInput("value", "X");
    fixture.componentRef.setInput("valueClassName", "font-semibold");
    await fixture.whenStable();
    const span = native.querySelector("span");
    expect(span?.className).toContain("font-semibold");
  });

  it("appends placeholderClassName only to the placeholder span", async () => {
    fixture.componentRef.setInput("placeholder", "P");
    fixture.componentRef.setInput("placeholderClassName", "italic");
    await fixture.whenStable();
    const span = native.querySelector("span");
    expect(span?.className).toContain("italic");
  });
});

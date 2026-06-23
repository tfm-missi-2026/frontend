import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiDatePickerComponent } from "./date-picker.component";

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

function buildFixture(
  opts: Record<string, unknown> = {},
): ComponentFixture<UiDatePickerComponent> {
  const fixture = TestBed.createComponent(UiDatePickerComponent);
  applyInputs(fixture, {
    id: "demo-date",
    labelText: "Fecha",
    placeholder: "YYYY-MM-DD",
    ...opts,
  });
  fixture.detectChanges();
  return fixture;
}

describe("UiDatePickerComponent", () => {
  it("should create", () => {
    const fixture = buildFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("renders the wrapper with data-testid", () => {
    const fixture = buildFixture();
    const wrapper = fixture.nativeElement.querySelector(
      "[data-testid='datepicker-wrapper']",
    );
    expect(wrapper).not.toBeNull();
  });

  it("renders the input with the given id", () => {
    const fixture = buildFixture({ id: "my-date" });
    const input = fixture.nativeElement.querySelector(
      "[data-testid='datepicker']",
    ) as HTMLInputElement;
    expect(input.id).toBe("my-date");
  });

  it("renders the form label when labelText is provided", () => {
    const fixture = buildFixture({ labelText: "Fecha" });
    const label = fixture.nativeElement.querySelector("label");
    expect(label).not.toBeNull();
    expect(label?.textContent).toContain("Fecha");
  });

  it("does NOT render a label when labelText is omitted", () => {
    const fixture = buildFixture({ labelText: undefined });
    const label = fixture.nativeElement.querySelector("label");
    expect(label).toBeNull();
  });
});

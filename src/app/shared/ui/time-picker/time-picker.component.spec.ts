import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiTimePickerComponent } from "./time-picker.component";

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
): ComponentFixture<UiTimePickerComponent> {
  const fixture = TestBed.createComponent(UiTimePickerComponent);
  applyInputs(fixture, {
    id: "demo-time",
    labelText: "Hora",
    placeholder: "HH:mm",
    ...opts,
  });
  fixture.detectChanges();
  return fixture;
}

describe("UiTimePickerComponent", () => {
  it("should create", () => {
    const fixture = buildFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("renders the wrapper with data-testid", () => {
    const fixture = buildFixture();
    const wrapper = fixture.nativeElement.querySelector(
      "[data-testid='timepicker-wrapper']",
    );
    expect(wrapper).not.toBeNull();
  });

  it("renders the input with the given id", () => {
    const fixture = buildFixture({ id: "my-time" });
    const input = fixture.nativeElement.querySelector(
      "[data-testid='timepicker']",
    ) as HTMLInputElement;
    expect(input.id).toBe("my-time");
  });

  it("renders the form label when labelText is provided", () => {
    const fixture = buildFixture({ labelText: "Hora" });
    const label = fixture.nativeElement.querySelector("label");
    expect(label).not.toBeNull();
    expect(label?.textContent).toContain("Hora");
  });
});

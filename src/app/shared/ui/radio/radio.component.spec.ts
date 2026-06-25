import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiRadioComponent } from "./radio.component";

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
): ComponentFixture<UiRadioComponent> {
  const fixture = TestBed.createComponent(UiRadioComponent);
  applyInputs(fixture, {
    id: "demo-radio",
    name: "group",
    value: "opt-1",
    label: "Opción 1",
    ...opts,
  });
  fixture.detectChanges();
  return fixture;
}

describe("UiRadioComponent", () => {
  it("should create", () => {
    const fixture = buildFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("renders a real <input type=radio> with the given id/name/value", () => {
    const fixture = buildFixture();
    const input = fixture.nativeElement.querySelector(
      "[data-testid='radio-input']",
    ) as HTMLInputElement;
    expect(input.tagName).toBe("INPUT");
    expect(input.type).toBe("radio");
    expect(input.id).toBe("demo-radio");
    expect(input.name).toBe("group");
    expect(input.value).toBe("opt-1");
  });

  it("renders the label text when label is provided", () => {
    const fixture = buildFixture({ label: "Mi opción" });
    const label = fixture.nativeElement.querySelector("span:last-child");
    expect(label?.textContent).toContain("Mi opción");
  });

  it("emits valueChange with the configured value when clicked", () => {
    const fixture = buildFixture();
    let emitted: string | undefined;
    fixture.componentInstance.valueChange.subscribe((v) => (emitted = v));
    const input = fixture.nativeElement.querySelector(
      "[data-testid='radio-input']",
    ) as HTMLInputElement;
    input.click();
    expect(emitted).toBe("opt-1");
  });

  it("does NOT emit when disabled", () => {
    const fixture = buildFixture({ disabled: true });
    let emitted: string | undefined;
    fixture.componentInstance.valueChange.subscribe((v) => (emitted = v));
    const input = fixture.nativeElement.querySelector(
      "[data-testid='radio-input']",
    ) as HTMLInputElement;
    input.click();
    expect(emitted).toBeUndefined();
  });

  it("reflects the checked state on the input element", () => {
    const fixture = buildFixture({ checked: true });
    const input = fixture.nativeElement.querySelector(
      "[data-testid='radio-input']",
    ) as HTMLInputElement;
    expect(input.checked).toBe(true);
  });
});

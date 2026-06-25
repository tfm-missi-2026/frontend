import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiPhoneInputComponent } from "./phone-input.component";
import type { CountryCode } from "./types";

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

const countries: CountryCode[] = [
  { code: "+1", label: "(555) 000-0000" },
  { code: "+34", label: "600 000 000" },
  { code: "+52", label: "55 0000 0000" },
];

function buildFixture(
  opts: Record<string, unknown> = {},
): ComponentFixture<UiPhoneInputComponent> {
  const fixture = TestBed.createComponent(UiPhoneInputComponent);
  applyInputs(fixture, {
    id: "demo-phone",
    labelText: "Teléfono",
    countries,
    ...opts,
  });
  fixture.detectChanges();
  return fixture;
}

describe("UiPhoneInputComponent", () => {
  it("should create", () => {
    const fixture = buildFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("renders the wrapper with data-testid", () => {
    const fixture = buildFixture();
    const wrapper = fixture.nativeElement.querySelector(
      "[data-testid='phone-input-wrapper']",
    );
    expect(wrapper).not.toBeNull();
  });

  it("renders one <option> per country", () => {
    const fixture = buildFixture();
    const select = fixture.nativeElement.querySelector(
      "[data-testid='phone-country']",
    ) as HTMLSelectElement;
    expect(select.options.length).toBe(countries.length);
    expect(select.options[0].value).toBe("+1");
  });

  it("pre-selects the first country on init", () => {
    const fixture = buildFixture();
    expect(fixture.componentInstance.selectedCountry()).toBe("+1");
  });

  it("emits valueChange when the phone number changes", () => {
    const fixture = buildFixture();
    const emitted: string[] = [];
    fixture.componentInstance.valueChange.subscribe((v) => emitted.push(v));
    const input = fixture.nativeElement.querySelector(
      "[data-testid='phone-number']",
    ) as HTMLInputElement;
    input.value = "555-1234";
    input.dispatchEvent(new Event("input"));
    expect(emitted.length).toBe(1);
    expect(emitted[0]).toContain("+1");
    expect(emitted[0]).toContain("555-1234");
  });
});

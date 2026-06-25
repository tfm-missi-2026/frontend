import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiSwitchComponent } from "./switch.component";

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
): ComponentFixture<UiSwitchComponent> {
  const fixture = TestBed.createComponent(UiSwitchComponent);
  applyInputs(fixture, { label: "Notificaciones", ...opts });
  fixture.detectChanges();
  return fixture;
}

describe("UiSwitchComponent", () => {
  it("should create", () => {
    const fixture = buildFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("renders the label text when label is provided", () => {
    const fixture = buildFixture({ label: "Activar" });
    const labelEl = fixture.nativeElement.querySelector("span");
    expect(labelEl?.textContent).toContain("Activar");
  });

  it("emits checkedChange with the toggled value when clicked", () => {
    const fixture = buildFixture({ checked: false });
    const emitted: boolean[] = [];
    fixture.componentInstance.checkedChange.subscribe((v) => emitted.push(v));
    fixture.componentInstance.onToggle();
    expect(emitted).toEqual([true]);
  });

  it("does NOT emit when disabled", () => {
    const fixture = buildFixture({ checked: false, disabled: true });
    const emitted: boolean[] = [];
    fixture.componentInstance.checkedChange.subscribe((v) => emitted.push(v));
    fixture.componentInstance.onToggle();
    expect(emitted).toEqual([]);
  });

  it("renders a real <input type=checkbox> reflecting the checked state", () => {
    const fixture = buildFixture({ checked: true });
    const input = fixture.nativeElement.querySelector(
      "[data-testid='switch-input']",
    ) as HTMLInputElement;
    expect(input.type).toBe("checkbox");
    expect(input.checked).toBe(true);
  });
});

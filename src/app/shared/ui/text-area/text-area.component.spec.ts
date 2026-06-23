import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiTextAreaComponent } from "./text-area.component";

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
): ComponentFixture<UiTextAreaComponent> {
  const fixture = TestBed.createComponent(UiTextAreaComponent);
  applyInputs(fixture, {
    id: "demo-ta",
    labelText: "Descripción",
    placeholder: "Escribe…",
    ...opts,
  });
  fixture.detectChanges();
  return fixture;
}

describe("UiTextAreaComponent", () => {
  it("should create", () => {
    const fixture = buildFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("renders the wrapper with data-testid", () => {
    const fixture = buildFixture();
    const wrapper = fixture.nativeElement.querySelector(
      "[data-testid='textarea-wrapper']",
    );
    expect(wrapper).not.toBeNull();
  });

  it("renders a <textarea> with the given id and rows", () => {
    const fixture = buildFixture({ id: "my-ta", rows: 5 });
    const ta = fixture.nativeElement.querySelector(
      "[data-testid='textarea']",
    ) as HTMLTextAreaElement;
    expect(ta.tagName).toBe("TEXTAREA");
    expect(ta.id).toBe("my-ta");
    expect(ta.rows).toBe(5);
  });

  it("renders the form label when labelText is provided", () => {
    const fixture = buildFixture({ labelText: "Comentarios" });
    const label = fixture.nativeElement.querySelector("label");
    expect(label).not.toBeNull();
    expect(label?.textContent).toContain("Comentarios");
  });

  it("emits valueChange on input", () => {
    const fixture = buildFixture();
    const emitted: string[] = [];
    fixture.componentInstance.valueChange.subscribe((v) => emitted.push(v));
    const ta = fixture.nativeElement.querySelector(
      "[data-testid='textarea']",
    ) as HTMLTextAreaElement;
    ta.value = "hola";
    ta.dispatchEvent(new Event("input"));
    expect(emitted).toEqual(["hola"]);
  });
});

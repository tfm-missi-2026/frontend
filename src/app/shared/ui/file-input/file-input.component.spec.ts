import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiFileInputComponent } from "./file-input.component";

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
): ComponentFixture<UiFileInputComponent> {
  const fixture = TestBed.createComponent(UiFileInputComponent);
  applyInputs(fixture, { id: "demo-file", ...opts });
  fixture.detectChanges();
  return fixture;
}

describe("UiFileInputComponent", () => {
  it("should create", () => {
    const fixture = buildFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("renders a real <input type=file> with the given id", () => {
    const fixture = buildFixture({ id: "my-file", accept: ".pdf" });
    const input = fixture.nativeElement.querySelector(
      "[data-testid='file-input']",
    ) as HTMLInputElement;
    expect(input.tagName).toBe("INPUT");
    expect(input.type).toBe("file");
    expect(input.id).toBe("my-file");
    expect(input.accept).toBe(".pdf");
  });

  it("reflects the multiple attribute", () => {
    const fixture = buildFixture({ multiple: true });
    const input = fixture.nativeElement.querySelector(
      "[data-testid='file-input']",
    ) as HTMLInputElement;
    expect(input.multiple).toBe(true);
  });

  it("emits change on native change event", () => {
    const fixture = buildFixture();
    const emitted: Event[] = [];
    fixture.componentInstance.change.subscribe((e) => emitted.push(e));
    const input = fixture.nativeElement.querySelector(
      "[data-testid='file-input']",
    ) as HTMLInputElement;
    input.dispatchEvent(new Event("change"));
    expect(emitted.length).toBe(1);
  });
});

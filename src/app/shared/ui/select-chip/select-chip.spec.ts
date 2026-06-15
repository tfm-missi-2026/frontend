import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiSelectChipComponent } from "./select-chip";

describe("UiSelectChip", () => {
  let fixture: ComponentFixture<UiSelectChipComponent>;
  let component: UiSelectChipComponent;
  let native: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSelectChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSelectChipComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("label", "Angular");
    native = fixture.nativeElement;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("renders the label", () => {
    expect(native.textContent).toContain("Angular");
  });

  it("renders the remove button by default", () => {
    const btn = native.querySelector("button");
    expect(btn).toBeTruthy();
    expect(btn?.getAttribute("aria-label")).toBe("Quitar");
  });

  it("hides the remove button when disabled", async () => {
    fixture.componentRef.setInput("disabled", true);
    await fixture.whenStable();
    expect(native.querySelector("button")).toBeNull();
    expect(component.containerClasses()).toContain("opacity-70");
  });

  it("hides the remove button when readOnly", async () => {
    fixture.componentRef.setInput("readOnly", true);
    await fixture.whenStable();
    expect(native.querySelector("button")).toBeNull();
    expect(component.containerClasses()).toContain("opacity-70");
  });

  it("uses a custom removeLabel for aria", async () => {
    fixture.componentRef.setInput("removeLabel", "Remove");
    await fixture.whenStable();
    const btn = native.querySelector("button");
    expect(btn?.getAttribute("aria-label")).toBe("Remove");
  });

  it("emits remove on click and stops propagation", () => {
    let propagated = true;
    let emitted = false;
    component.remove.subscribe(() => (emitted = true));

    const event = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(event, "stopPropagation", {
      value: () => (propagated = false),
    });
    native.querySelector("button")?.dispatchEvent(event);

    expect(emitted).toBeTrue();
    expect(propagated).toBeFalse();
  });

  it("appends className to the container", async () => {
    fixture.componentRef.setInput("className", "my-chip");
    await fixture.whenStable();
    const span = native.querySelector("span");
    expect(span?.className).toContain("my-chip");
    expect(span?.className).toContain("rounded-md");
  });
});

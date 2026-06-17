import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiFieldErrorComponent } from "./field-error";

describe("UiFieldError", () => {
  let fixture: ComponentFixture<UiFieldErrorComponent>;
  let component: UiFieldErrorComponent;
  let native: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiFieldErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiFieldErrorComponent);
    component = fixture.componentInstance;
    native = fixture.nativeElement;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("renders nothing when message is empty", () => {
    expect(native.children.length).toBe(0);
  });

  it("renders nothing when message is undefined", async () => {
    fixture.componentRef.setInput("message", undefined);
    await fixture.whenStable();
    expect(native.children.length).toBe(0);
  });

  it("renders the message and exposes role=alert", async () => {
    fixture.componentRef.setInput("message", "Requerido");
    await fixture.whenStable();
    const span = native.querySelector("span");
    expect(span).toBeTruthy();
    expect(span?.textContent).toContain("Requerido");
    expect(span?.getAttribute("role")).toBe("alert");
  });

  it("applies the id attribute when provided", async () => {
    fixture.componentRef.setInput("message", "Requerido");
    fixture.componentRef.setInput("id", "email-error");
    await fixture.whenStable();
    const span = native.querySelector("span");
    expect(span?.id).toBe("email-error");
  });

  it("does not emit an id attribute when id is empty", async () => {
    fixture.componentRef.setInput("message", "Requerido");
    await fixture.whenStable();
    const span = native.querySelector("span");
    expect(span?.getAttribute("id")).toBeNull();
  });

  it("appends className to the container", async () => {
    fixture.componentRef.setInput("message", "Requerido");
    fixture.componentRef.setInput("className", "mt-1");
    await fixture.whenStable();
    const span = native.querySelector("span");
    expect(span?.className).toContain("text-error-500");
    expect(span?.className).toContain("mt-1");
  });
});

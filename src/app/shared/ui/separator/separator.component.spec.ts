import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";
import { By } from "@angular/platform-browser";

import { UiSeparatorComponent } from "./separator";

@Component({
  selector: "UiSeparatorHost",
  standalone: true,
  imports: [UiSeparatorComponent],
  template: `
    <UiSeparator
      [orientation]="orientation"
      [variant]="variant"
      [thickness]="thickness"
      [spacing]="spacing"
      [color]="color"
      [className]="className"
    />
  `,
})
class UiSeparatorHostComponent {
  orientation: "horizontal" | "vertical" = "horizontal";
  variant: "solid" | "dashed" | "dotted" = "solid";
  thickness: "thin" | "medium" | "thick" = "thin";
  spacing: "none" | "sm" | "md" | "lg" = "none";
  color: "gray" | "subtle" | "brand" | "danger" = "gray";
  className = "";
}

describe("UiSeparator", () => {
  let fixture: ComponentFixture<UiSeparatorHostComponent>;
  let host: UiSeparatorHostComponent;

  function getHr(): HTMLElement {
    return fixture.debugElement.query(
      By.css('[data-testid="separator"]'),
    ).nativeElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSeparatorHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSeparatorHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("renders a semantic <hr> with default testid", () => {
    const hr = getHr();
    expect(hr.tagName.toLowerCase()).toBe("hr");
    expect(hr.getAttribute("data-orientation")).toBe("horizontal");
    expect(hr.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("applies horizontal classes by default (w-full, h-px, border-t)", () => {
    const hr = getHr();
    expect(hr.className).toContain("w-full");
    expect(hr.className).toContain("h-px");
    expect(hr.className).toContain("border-solid");
    expect(hr.className).toContain("border-t");
  });

  it("switches to vertical orientation classes", () => {
    host.orientation = "vertical";
    fixture.detectChanges();
    const hr = getHr();
    expect(hr.getAttribute("data-orientation")).toBe("vertical");
    expect(hr.className).toContain("w-px");
    expect(hr.className).toContain("h-full");
    expect(hr.className).toContain("border-l");
  });

  it("applies dashed variant", () => {
    host.variant = "dashed";
    fixture.detectChanges();
    expect(getHr().className).toContain("border-dashed");
  });

  it("applies dotted variant", () => {
    host.variant = "dotted";
    fixture.detectChanges();
    expect(getHr().className).toContain("border-dotted");
  });

  it("applies medium thickness with border-t-2", () => {
    host.thickness = "medium";
    fixture.detectChanges();
    expect(getHr().className).toContain("border-t-2");
  });

  it("applies thick thickness with border-t-4", () => {
    host.thickness = "thick";
    fixture.detectChanges();
    expect(getHr().className).toContain("border-t-4");
  });

  it("applies spacing margins", () => {
    host.spacing = "md";
    fixture.detectChanges();
    const hr = getHr();
    expect(hr.className).toContain("my-4");
    expect(hr.className).toContain("mx-4");
  });

  it("applies brand color classes", () => {
    host.color = "brand";
    fixture.detectChanges();
    expect(getHr().className).toContain("border-brand-500");
  });

  it("applies danger color classes", () => {
    host.color = "danger";
    fixture.detectChanges();
    expect(getHr().className).toContain("border-error-500");
  });

  it("appends className", () => {
    host.className = "my-custom-class";
    fixture.detectChanges();
    expect(getHr().className).toContain("my-custom-class");
  });
});

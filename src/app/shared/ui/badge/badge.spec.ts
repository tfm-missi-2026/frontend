import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiBadgeComponent } from "./badge";
import { BadgeColor, BadgeSize, BadgeVariant } from "./badge.types";

// Host component — los `input()` de UiBadge son read-only, así que el
// fixture directo no puede mutarlos. El host los pasa vía template binding.

@Component({
  standalone: true,
  imports: [UiBadgeComponent],
  template: `
    <UiBadge
      [variant]="variant"
      [size]="size"
      [color]="color"
      [startIcon]="startIcon"
      [endIcon]="endIcon"
    >
      {{ label }}
    </UiBadge>
  `,
})
class BadgeHostComponent {
  variant: BadgeVariant = "light";
  size: BadgeSize = "md";
  color: BadgeColor = "primary";
  startIcon: string | undefined = undefined;
  endIcon: string | undefined = undefined;
  label = "Primary";

  @ViewChild(UiBadgeComponent) badge!: UiBadgeComponent;
}

describe("UiBadge", () => {
  let fixture: ComponentFixture<BadgeHostComponent>;
  let host: BadgeHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(host.badge).toBeTruthy();
  });

  it("uses light variant and primary color by default", () => {
    const span = fixture.nativeElement.querySelector("span") as HTMLSpanElement;
    expect(span.className).toContain("bg-brand-50");
    expect(span.className).toContain("text-brand-500");
  });

  it("uses md text size by default", () => {
    expect(host.badge.sizeClass()).toBe("px-3 py-1 text-sm");
  });

  it("updates classes when color changes", () => {
    host.color = "success";
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector("span") as HTMLSpanElement;
    expect(span.className).toContain("bg-success-50");
  });

  it("applies solid variant classes when variant is solid", () => {
    host.variant = "solid";
    host.color = "error";
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector("span") as HTMLSpanElement;
    expect(span.className).toContain("bg-error-500");
    expect(span.className).toContain("text-white");
    expect(span.className).toContain("shadow-sm");
  });

  it("applies sm size class when size is sm", () => {
    host.size = "sm";
    fixture.detectChanges();
    expect(host.badge.sizeClass()).toBe("px-2.5 py-0.5 text-theme-xs");
  });

  it("applies ring and leading-none to keep text contained", () => {
    const span = fixture.nativeElement.querySelector("span") as HTMLSpanElement;
    expect(span.className).toContain("ring-1");
    expect(span.className).toContain("ring-inset");
    expect(span.className).toContain("ring-brand-500/20");
    expect(span.className).toContain("leading-none");
    expect(span.className).toContain("whitespace-nowrap");
  });

  it("renders project content inside the badge", () => {
    host.label = "Hello";
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector("span") as HTMLSpanElement;
    expect(span.textContent).toContain("Hello");
  });

  it("renders the startIcon when provided", () => {
    host.startIcon = '<svg class="test-icon">x</svg>';
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelectorAll("svg");
    expect(icons.length).toBe(1);
    expect(icons[0].classList.contains("test-icon")).toBeTrue();
  });

  it("renders the endIcon when provided", () => {
    host.endIcon = '<svg class="end-test">y</svg>';
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelectorAll("svg");
    expect(icons.length).toBe(1);
    expect(icons[0].classList.contains("end-test")).toBeTrue();
  });

  it("does not render icon spans when startIcon and endIcon are empty", () => {
    const wrapperSpans = fixture.nativeElement.querySelectorAll("span > span");
    expect(wrapperSpans.length).toBe(0);
  });

  it("produces the expected containerClasses string", () => {
    expect(host.badge.containerClasses()).toContain("inline-flex");
    expect(host.badge.containerClasses()).toContain("rounded-full");
    expect(host.badge.containerClasses()).toContain("font-medium");
    expect(host.badge.containerClasses()).toContain("text-sm");
    expect(host.badge.containerClasses()).toContain("bg-brand-50");
  });
});

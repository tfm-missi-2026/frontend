import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiAlertComponent } from "./alert.component";
import { AlertVariant } from "./alert.types";

// Host component — los `input()` de UiAlert son read-only, así que el
// fixture directo no puede mutarlos. El host los pasa vía template binding.

@Component({
  standalone: true,
  imports: [UiAlertComponent],
  template: `
    <UiAlert
      [variant]="variant"
      [title]="title"
      [message]="message"
      [showLink]="showLink"
      [linkHref]="linkHref"
      [linkText]="linkText"
    />
  `,
})
class AlertHostComponent {
  variant: AlertVariant = "info";
  title = "";
  message = "";
  showLink = false;
  linkHref = "#";
  linkText = "Learn more";

  @ViewChild(UiAlertComponent) alert!: UiAlertComponent;
}

describe("UiAlert", () => {
  let fixture: ComponentFixture<AlertHostComponent>;
  let host: AlertHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(host.alert).toBeTruthy();
  });

  it("uses the info variant by default", () => {
    expect(host.alert.variant()).toBe("info");
    expect(host.alert.surfaceVariant()).toBe("info");
    expect(host.alert.iconVariant()).toBe("info");
  });

  it('maps variant="success" to surfaceVariant and iconVariant', () => {
    host.variant = "success";
    fixture.detectChanges();
    expect(host.alert.surfaceVariant()).toBe("success");
    expect(host.alert.iconVariant()).toBe("success");
  });

  it('maps variant="error" to surfaceVariant and iconVariant', () => {
    host.variant = "error";
    fixture.detectChanges();
    expect(host.alert.surfaceVariant()).toBe("error");
    expect(host.alert.iconVariant()).toBe("error");
  });

  it('maps variant="warning" to surfaceVariant and iconVariant', () => {
    host.variant = "warning";
    fixture.detectChanges();
    expect(host.alert.surfaceVariant()).toBe("warning");
    expect(host.alert.iconVariant()).toBe("warning");
  });

  it("renders the surface with the alert testid", () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[data-testid="alert"]')).not.toBeNull();
  });

  it("renders the icon slot with the alert-icon testid", () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[data-testid="alert-icon"]')).not.toBeNull();
  });

  it("renders title and message when provided", () => {
    host.title = "Heads up";
    host.message = "Something happened.";
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain("Heads up");
    expect(root.textContent).toContain("Something happened.");
  });

  it("hides the link when showLink is false", () => {
    host.showLink = false;
    host.linkText = "Read more";
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector("a");
    expect(link).toBeNull();
  });

  it("renders the link with the given text and href when showLink is true", () => {
    host.showLink = true;
    host.linkHref = "/docs";
    host.linkText = "Read the docs";
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector(
      "a",
    ) as HTMLAnchorElement | null;
    expect(link).toBeTruthy();
    expect(link?.textContent?.trim()).toBe("Read the docs");
    expect(link?.getAttribute("href")).toBe("/docs");
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";
import { By } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";

import { UiLinkComponent } from "./link";

@Component({
  selector: "UiLinkHost",
  standalone: true,
  imports: [UiLinkComponent],
  template: `
    <UiLink
      [to]="to"
      [href]="href"
      [variant]="variant"
      [size]="size"
      [underline]="underline"
      [disabled]="disabled"
      [target]="target"
      [rel]="rel"
      [className]="className"
      (click)="onClick($event)"
    >
      <span class="custom">contenido html</span>
    </UiLink>
  `,
})
class UiLinkHostComponent {
  to: string | undefined;
  href: string | undefined;
  variant: "primary" | "secondary" | "danger" | "subtle" | "unstyled" =
    "primary";
  size: "sm" | "md" | "lg" = "md";
  underline: "hover" | "always" | "none" = "hover";
  disabled = false;
  target: string | undefined;
  rel: string | undefined;
  className = "";
  clicked = 0;

  onClick(_e: MouseEvent): void {
    this.clicked += 1;
  }
}

describe("UiLink", () => {
  let fixture: ComponentFixture<UiLinkHostComponent>;
  let host: UiLinkHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiLinkHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UiLinkHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("renders an <a> with the projected HTML content", () => {
    const anchor: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="link"]'),
    ).nativeElement;
    expect(anchor.tagName.toLowerCase()).toBe("a");
    expect(anchor.querySelector("span.custom")?.textContent).toBe(
      "contenido html",
    );
  });

  it("uses routerLink when `to` is defined and no `href`", () => {
    host.to = "/profile";
    fixture.detectChanges();
    const anchor: HTMLAnchorElement = fixture.debugElement.query(
      By.css('[data-testid="link"]'),
    ).nativeElement;
    expect(anchor.getAttribute("href")).toBe("/profile");
  });

  it("prefers `href` over `to` when both are defined", () => {
    host.to = "/profile";
    host.href = "https://example.com";
    fixture.detectChanges();
    const anchor: HTMLAnchorElement = fixture.debugElement.query(
      By.css('[data-testid="link"]'),
    ).nativeElement;
    expect(anchor.getAttribute("href")).toBe("https://example.com");
  });

  it("sets rel=noopener noreferrer automatically for target=_blank", () => {
    host.href = "https://example.com";
    host.target = "_blank";
    fixture.detectChanges();
    const anchor: HTMLAnchorElement = fixture.debugElement.query(
      By.css('[data-testid="link"]'),
    ).nativeElement;
    expect(anchor.getAttribute("target")).toBe("_blank");
    expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("respects an explicit rel even when target=_blank", () => {
    host.href = "https://example.com";
    host.target = "_blank";
    host.rel = "nofollow";
    fixture.detectChanges();
    const anchor: HTMLAnchorElement = fixture.debugElement.query(
      By.css('[data-testid="link"]'),
    ).nativeElement;
    expect(anchor.getAttribute("rel")).toBe("nofollow");
  });

  it("applies the variant class", () => {
    host.variant = "danger";
    fixture.detectChanges();
    const anchor: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="link"]'),
    ).nativeElement;
    expect(anchor.className).toContain("text-error-500");
  });

  it("applies the size class", () => {
    host.size = "lg";
    fixture.detectChanges();
    const anchor: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="link"]'),
    ).nativeElement;
    expect(anchor.className).toContain("text-base");
  });

  it("applies the underline class", () => {
    host.underline = "always";
    fixture.detectChanges();
    const anchor: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="link"]'),
    ).nativeElement;
    expect(anchor.className).toContain("underline");
  });

  it("appends className", () => {
    host.className = "px-3 py-1";
    fixture.detectChanges();
    const anchor: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="link"]'),
    ).nativeElement;
    expect(anchor.className).toContain("px-3");
    expect(anchor.className).toContain("py-1");
  });

  it("emits click on click", () => {
    const anchor: HTMLAnchorElement = fixture.debugElement.query(
      By.css('[data-testid="link"]'),
    ).nativeElement;
    anchor.click();
    expect(host.clicked).toBe(1);
  });

  it("does not emit click and blocks navigation when disabled", () => {
    host.disabled = true;
    host.href = "https://example.com";
    fixture.detectChanges();
    const anchor: HTMLAnchorElement = fixture.debugElement.query(
      By.css('[data-testid="link"]'),
    ).nativeElement;
    const evt = new MouseEvent("click", { bubbles: true, cancelable: true });
    anchor.dispatchEvent(evt);
    expect(host.clicked).toBe(0);
    expect(evt.defaultPrevented).toBe(true);
    expect(anchor.getAttribute("aria-disabled")).toBe("true");
    expect(anchor.getAttribute("tabindex")).toBe("-1");
  });
});

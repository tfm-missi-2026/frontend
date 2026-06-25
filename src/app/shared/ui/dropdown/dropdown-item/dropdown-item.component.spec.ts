import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";
import { By } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";

import { UiDropdownItemComponent } from "./dropdown-item.component";

@Component({
  selector: "UiDropdownItemHost",
  standalone: true,
  imports: [UiDropdownItemComponent],
  template: `
    <UiDropdownItem
      [to]="to"
      [tag]="tag"
      [baseClassName]="baseClassName"
      [className]="className"
      [disabled]="disabled"
      (itemClick)="onItem()"
    >
      Item
    </UiDropdownItem>
  `,
})
class DropdownItemHostComponent {
  to: string | undefined;
  tag: "button" | "a" = "button";
  baseClassName = "px-4 py-2";
  className = "";
  disabled = false;
  clicked = 0;

  onItem(): void {
    this.clicked += 1;
  }
}

describe("UiDropdownItem", () => {
  let fixture: ComponentFixture<DropdownItemHostComponent>;
  let host: DropdownItemHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownItemHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownItemHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("renders a <button> by default", () => {
    const el: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="dropdown-item"]'),
    ).nativeElement;
    expect(el.tagName.toLowerCase()).toBe("button");
    expect(el.getAttribute("type")).toBe("button");
  });

  it("renders an <a> when tag is 'a'", () => {
    host.tag = "a";
    host.to = "/profile";
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="dropdown-item"]'),
    ).nativeElement;
    expect(el.tagName.toLowerCase()).toBe("a");
    expect(el.getAttribute("href")).toBe("/profile");
  });

  it("renders an <a> when 'to' is defined even if tag is 'button'", () => {
    host.to = "/profile";
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="dropdown-item"]'),
    ).nativeElement;
    expect(el.tagName.toLowerCase()).toBe("a");
  });

  it("emits itemClick on click", () => {
    const el: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="dropdown-item"]'),
    ).nativeElement;
    el.click();
    expect(host.clicked).toBe(1);
  });

  it("appends baseClassName and className", () => {
    host.baseClassName = "px-4 py-2";
    host.className = "text-red-500";
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="dropdown-item"]'),
    ).nativeElement;
    expect(el.className).toContain("px-4");
    expect(el.className).toContain("py-2");
    expect(el.className).toContain("text-red-500");
  });

  it("does not emit itemClick when disabled", () => {
    host.disabled = true;
    fixture.detectChanges();
    const el: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid="dropdown-item"]'),
    ).nativeElement;
    el.click();
    expect(host.clicked).toBe(0);
  });
});

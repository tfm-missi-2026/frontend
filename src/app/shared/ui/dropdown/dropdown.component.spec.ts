import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { By } from "@angular/platform-browser";

import { UiDropdownComponent } from "./dropdown.component";
import { UiDropdownItemComponent } from "./dropdown-item";

@Component({
  selector: "UiDropdownTestHost",
  standalone: true,
  imports: [UiDropdownComponent, UiDropdownItemComponent],
  template: `
    <div class="relative">
      <button type="button" class="dropdown-toggle" (click)="toggle()">
        Toggle
      </button>
      <UiDropdown
        [isOpen]="open()"
        (close)="onClose()"
        [className]="className"
        [align]="align"
      >
        <UiDropdownItem (itemClick)="onItem()">Action</UiDropdownItem>
      </UiDropdown>
    </div>
  `,
})
class DropdownTestHostComponent {
  readonly open = signal(false);
  className = "";
  align: "right" | "left" | "center" = "right";
  closed = 0;
  clicked = 0;

  toggle(): void {
    this.open.set(!this.open());
  }
  onClose(): void {
    this.closed += 1;
  }
  onItem(): void {
    this.clicked += 1;
  }
}

describe("UiDropdown", () => {
  let fixture: ComponentFixture<DropdownTestHostComponent>;
  let host: DropdownTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownTestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("does not render the panel when isOpen is false", () => {
    expect(
      fixture.debugElement.query(By.directive(UiDropdownComponent)),
    ).toBeNull();
  });

  it("renders the panel when isOpen is true", () => {
    host.open.set(true);
    fixture.detectChanges();
    const panel = fixture.debugElement.query(
      By.css('[data-testid="dropdown"]'),
    );
    expect(panel).not.toBeNull();
  });

  it("appends className to the panel", () => {
    host.open.set(true);
    host.className = "w-40 p-2";
    fixture.detectChanges();
    const panel: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="dropdown"]'),
    ).nativeElement;
    expect(panel.className).toContain("w-40");
    expect(panel.className).toContain("p-2");
  });

  it("uses right alignment by default", () => {
    host.open.set(true);
    fixture.detectChanges();
    const panel: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="dropdown"]'),
    ).nativeElement;
    expect(panel.className).toContain("right-0");
  });

  it("applies the align input", () => {
    host.open.set(true);
    host.align = "left";
    fixture.detectChanges();
    const panel: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="dropdown"]'),
    ).nativeElement;
    expect(panel.className).toContain("left-0");
  });

  it("emits close when clicking outside the panel", () => {
    host.open.set(true);
    fixture.detectChanges();
    const evt = new MouseEvent("mousedown", { bubbles: true });
    document.body.dispatchEvent(evt);
    expect(host.closed).toBe(1);
  });

  it("does not emit close when clicking inside the panel", () => {
    host.open.set(true);
    fixture.detectChanges();
    const panel: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="dropdown"]'),
    ).nativeElement;
    const evt = new MouseEvent("mousedown", { bubbles: true });
    panel.dispatchEvent(evt);
    expect(host.closed).toBe(0);
  });

  it("emits close when pressing Escape", () => {
    host.open.set(true);
    fixture.detectChanges();
    const evt = new KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(evt);
    expect(host.closed).toBe(1);
  });

  it("emits itemClick when a dropdown item is clicked", () => {
    host.open.set(true);
    fixture.detectChanges();
    const item: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid="dropdown-item"]'),
    ).nativeElement;
    item.click();
    expect(host.clicked).toBe(1);
  });
});

import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiAvatarTextComponent } from "./avatar-text";

// Host component — el `name` es read-only, así que el host lo pasa vía
// template binding.

@Component({
  standalone: true,
  imports: [UiAvatarTextComponent],
  template: `<UiAvatarText [name]="name" [className]="className" />`,
})
class AvatarTextHostComponent {
  name = "Ada Lovelace";
  className = "";

  @ViewChild(UiAvatarTextComponent) avatar!: UiAvatarTextComponent;
}

describe("UiAvatarText", () => {
  let fixture: ComponentFixture<AvatarTextHostComponent>;
  let host: AvatarTextHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarTextHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarTextHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(host.avatar).toBeTruthy();
  });

  it("extracts the initials of a full name (max 2 letters)", () => {
    expect(host.avatar.initials()).toBe("AL");
  });

  it("returns uppercase initials", () => {
    host.name = "juan perez";
    fixture.detectChanges();
    expect(host.avatar.initials()).toBe("JP");
  });

  it("returns an empty string when name is empty", () => {
    host.name = "";
    fixture.detectChanges();
    expect(host.avatar.initials()).toBe("");
  });

  it("picks a stable color class for the same name", () => {
    const first = host.avatar.colorClass();
    expect(first).toMatch(/^bg-[a-z]+-100 text-[a-z]+-600$/);
    expect(host.avatar.colorClass()).toBe(first);
  });

  it("appends the className to the container", () => {
    host.className = "shadow-md";
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector("div");
    expect(root.className).toContain("shadow-md");
  });
});

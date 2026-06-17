import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiAvatarComponent } from "./avatar.component";
import { AvatarSize, AvatarStatus } from "./avatar.types";

// Host component — los `input()` de UiAvatar son read-only, así que el
// fixture directo no puede mutarlos. El host los pasa vía template binding.

@Component({
  standalone: true,
  imports: [UiAvatarComponent],
  template: `
    <UiAvatar [src]="src" [alt]="alt" [size]="size" [status]="status" />
  `,
})
class AvatarHostComponent {
  src = "/images/user/user-01.jpg";
  alt = "User Avatar";
  size: AvatarSize = "medium";
  status: AvatarStatus = "none";

  @ViewChild(UiAvatarComponent) avatar!: UiAvatarComponent;
}

describe("UiAvatar", () => {
  let fixture: ComponentFixture<AvatarHostComponent>;
  let host: AvatarHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(host.avatar).toBeTruthy();
  });

  it("renders the provided src and alt on the <img>", () => {
    const img = fixture.nativeElement.querySelector("img") as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toContain("/images/user/user-01.jpg");
    expect(img.alt).toBe("User Avatar");
  });

  it("uses the medium size class by default", () => {
    expect(host.avatar.sizeClasses()).toContain("h-10");
    expect(host.avatar.sizeClasses()).toContain("w-10");
  });

  it("updates size classes when size changes", () => {
    host.size = "xxlarge";
    fixture.detectChanges();
    expect(host.avatar.sizeClasses()).toContain("h-16");
    expect(host.avatar.sizeClasses()).toContain("w-16");
  });

  it('hides the status dot when status is "none"', () => {
    host.status = "none";
    fixture.detectChanges();
    const dot = fixture.nativeElement.querySelector("span");
    expect(dot).toBeNull();
  });

  it("renders a status dot for online status", () => {
    host.status = "online";
    fixture.detectChanges();
    const dot = fixture.nativeElement.querySelector("span");
    expect(dot).toBeTruthy();
    expect(host.avatar.statusDotClasses()).toContain("bg-success-500");
  });

  it("renders a status dot for offline status", () => {
    host.status = "offline";
    fixture.detectChanges();
    expect(host.avatar.statusDotClasses()).toContain("bg-error-400");
  });

  it("renders a status dot for busy status", () => {
    host.status = "busy";
    fixture.detectChanges();
    expect(host.avatar.statusDotClasses()).toContain("bg-warning-500");
  });
});

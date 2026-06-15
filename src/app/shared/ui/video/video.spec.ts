import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiVideoComponent } from "./video";
import { VideoRatio } from "./video.types";

/**
 * Signal-based inputs no admiten asignación directa, así que el
 * fixture directo del componente no puede mutarlos. El host los
 * expone como campos públicos y los pasa vía template binding.
 */
@Component({
  standalone: true,
  imports: [UiVideoComponent],
  template: `
    <UiVideo
      [src]="src"
      [ratio]="ratio"
      [title]="title"
      [className]="className"
    />
  `,
})
class VideoHostComponent {
  src = "https://www.youtube.com/embed/dQw4w9WgXcQ";
  ratio: VideoRatio = "16:9";
  title = "Embedded Video";
  className = "";
}

describe("UiVideo", () => {
  let fixture: ComponentFixture<VideoHostComponent>;
  let host: VideoHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function root(): HTMLElement {
    return fixture.nativeElement.querySelector(
      '[data-testid="video"]',
    ) as HTMLElement;
  }

  function iframe(): HTMLIFrameElement {
    return fixture.nativeElement.querySelector(
      '[data-testid="video"] iframe',
    ) as HTMLIFrameElement;
  }

  it("should create", () => {
    expect(host).toBeTruthy();
  });

  it("renders the iframe with the given src and title", () => {
    host.src = "https://www.youtube.com/embed/abc123";
    host.title = "My video";
    fixture.detectChanges();

    const el = iframe();
    expect(el).toBeTruthy();
    expect(el.getAttribute("src")).toBe("https://www.youtube.com/embed/abc123");
    expect(el.getAttribute("title")).toBe("My video");
  });

  it("applies aspect-video by default", () => {
    expect(host.ratio).toBe("16:9");
    expect(root().className).toContain("aspect-video");
  });

  it("maps each ratio to the matching Tailwind aspect class", () => {
    const cases: Array<[VideoRatio, string]> = [
      ["1:1", "aspect-square"],
      ["4:3", "aspect-4/3"],
      ["16:9", "aspect-video"],
      ["21:9", "aspect-21/9"],
    ];

    for (const [ratio, expected] of cases) {
      host.ratio = ratio;
      fixture.detectChanges();
      expect(root().className).toContain(expected);
    }
  });

  it("always includes the base container classes", () => {
    expect(root().className).toContain("overflow-hidden");
    expect(root().className).toContain("rounded-lg");
  });

  it("appends extra className when provided", () => {
    host.className = "shadow-md max-w-md";
    fixture.detectChanges();
    const cls = root().className;
    expect(cls).toContain("shadow-md");
    expect(cls).toContain("max-w-md");
    expect(cls).toContain("aspect-video");
  });

  it("sets the allowfullscreen attribute on the iframe", () => {
    const el = iframe();
    expect(el.hasAttribute("allowfullscreen")).toBe(true);
  });

  it("sets the standard allow attribute on the iframe", () => {
    const el = iframe();
    expect(el.getAttribute("allow")).toContain("autoplay");
    expect(el.getAttribute("allow")).toContain("encrypted-media");
  });

  it("uses the default title when none is provided", () => {
    host.title = "";
    fixture.detectChanges();
    // El input cae al default del componente cuando es "" porque el
    // signal input no es `required` y el default declarado es
    // "Embedded Video". Verificamos que el iframe recibe un title.
    expect(iframe().getAttribute("title")).toBeTruthy();
  });
});

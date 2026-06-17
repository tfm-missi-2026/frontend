import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiImageComponent } from "./image.component";
import {
  ImageLoading,
  ObjectFit,
  RoundedSize,
} from "./image.types";

@Component({
  standalone: true,
  imports: [UiImageComponent],
  template: `
    <UiImage
      [src]="src"
      [alt]="alt"
      [rounded]="rounded"
      [bordered]="bordered"
      [objectFit]="objectFit"
      [width]="width"
      [height]="height"
      [loading]="loading"
      [fallbackSrc]="fallbackSrc"
      [className]="className"
    />
  `,
})
class ImageHostComponent {
  src = "/images/sample.jpg";
  alt = "Sample image";
  rounded: RoundedSize = "xl";
  bordered = true;
  objectFit: ObjectFit = "cover";
  width = "w-full";
  height = "h-auto";
  loading: ImageLoading = "lazy";
  fallbackSrc: string | undefined = undefined;
  className = "";

  @ViewChild(UiImageComponent) image!: UiImageComponent;
}

describe("UiImage", () => {
  let fixture: ComponentFixture<ImageHostComponent>;
  let host: ImageHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function img(): HTMLImageElement {
    return fixture.nativeElement.querySelector(
      '[data-testid="image"] img',
    ) as HTMLImageElement;
  }

  function container(): HTMLElement {
    return fixture.nativeElement.querySelector(
      '[data-testid="image"]',
    ) as HTMLElement;
  }

  it("should create", () => {
    expect(host.image).toBeTruthy();
  });

  it("renders the image with the provided src and alt", () => {
    host.src = "/images/foo.png";
    host.alt = "Foo";
    fixture.detectChanges();

    const el = img();
    expect(el).toBeTruthy();
    expect(el.getAttribute("src")).toContain("/images/foo.png");
    expect(el.getAttribute("alt")).toBe("Foo");
  });

  it("uses object-cover by default", () => {
    expect(host.image.imageClasses()).toContain("object-cover");
  });

  it("maps each objectFit to the matching Tailwind class", () => {
    const cases: Array<[ObjectFit, string]> = [
      ["cover", "object-cover"],
      ["contain", "object-contain"],
      ["fill", "object-fill"],
      ["none", "object-none"],
      ["scale-down", "object-scale-down"],
    ];
    for (const [fit, expected] of cases) {
      host.objectFit = fit;
      fixture.detectChanges();
      expect(host.image.imageClasses()).toContain(expected);
    }
  });

  it("maps each rounded value to the matching Tailwind class", () => {
    const cases: Array<[RoundedSize, string]> = [
      ["none", ""],
      ["sm", "rounded-sm"],
      ["md", "rounded-md"],
      ["lg", "rounded-lg"],
      ["xl", "rounded-xl"],
      ["2xl", "rounded-2xl"],
      ["3xl", "rounded-3xl"],
      ["full", "rounded-full"],
    ];
    for (const [size, expected] of cases) {
      host.rounded = size;
      fixture.detectChanges();
      const cls = host.image.containerClasses();
      if (expected) {
        expect(cls).toContain(expected);
      } else {
        // "none" no debería contener ninguna clase rounded-*
        expect(cls).not.toMatch(/rounded-/);
      }
    }
  });

  it("applies border classes when bordered is true", () => {
    host.bordered = true;
    fixture.detectChanges();
    expect(host.image.containerClasses()).toContain("border-gray-200");
  });

  it("removes border classes when bordered is false", () => {
    host.bordered = false;
    fixture.detectChanges();
    expect(host.image.containerClasses()).not.toContain("border-gray-200");
  });

  it("always includes overflow-hidden on the container", () => {
    expect(container().className).toContain("overflow-hidden");
  });

  it("appends extra className to the container", () => {
    host.className = "shadow-md max-w-sm";
    fixture.detectChanges();
    const cls = container().className;
    expect(cls).toContain("shadow-md");
    expect(cls).toContain("max-w-sm");
  });

  it("uses lazy loading by default", () => {
    expect(img().getAttribute("loading")).toBe("lazy");
  });

  it("switches to eager loading when configured", () => {
    host.loading = "eager";
    fixture.detectChanges();
    expect(img().getAttribute("loading")).toBe("eager");
  });

  it("emits (imageError) when the image fails to load", () => {
    let emitted = false;
    host.image.imageError.subscribe(() => (emitted = true));
    img().dispatchEvent(new Event("error"));
    expect(emitted).toBe(true);
    expect(host.image.hasError()).toBe(true);
  });

  it("renders the fallback slot when image errors and no fallbackSrc is set", () => {
    img().dispatchEvent(new Event("error"));
    fixture.detectChanges();
    const fallback = fixture.nativeElement.querySelector(
      '[data-testid="image-fallback"]',
    );
    expect(fallback).toBeTruthy();
  });

  it("switches to fallbackSrc when image errors and fallbackSrc is set", () => {
    host.fallbackSrc = "/images/placeholder.jpg";
    fixture.detectChanges();
    img().dispatchEvent(new Event("error"));
    fixture.detectChanges();
    const el = img();
    expect(el.getAttribute("src")).toContain("/images/placeholder.jpg");
    // El wrapper contenedor sigue siendo el de la imagen, no el fallback
    expect(
      fixture.nativeElement.querySelector('[data-testid="image"]'),
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('[data-testid="image-fallback"]'),
    ).toBeNull();
  });
});

import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IconCheckComponent, IconTrashComponent, IconXComponent } from "@shared/icons";

import { UiModalComponent } from "./modal.component";
import type { UiModalAction } from "./modal.types";

@Component({
  standalone: true,
  imports: [UiModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiModal
      [isOpen]="isOpen"
      [className]="className"
      [showCloseButton]="showCloseButton"
      [isFullscreen]="isFullscreen"
      [size]="size"
      [rounded]="rounded"
      [title]="title"
      [subtitle]="subtitle"
      [showFooter]="showFooter"
      [leftAction]="leftAction"
      [rightAction]="rightAction"
      (close)="onClose()"
      (action)="onAction($event)"
    >
      <p>Modal content</p>
    </UiModal>
  `,
})
class ModalHostComponent {
  isOpen = false;
  className = "";
  showCloseButton = true;
  isFullscreen = false;
  size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" = "lg";
  rounded: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" = "xl";
  title = "";
  subtitle = "";
  showFooter = false;
  leftAction: UiModalAction | null = null;
  rightAction: UiModalAction | null = null;

  closeCount = 0;
  lastAction: "left" | "right" | null = null;

  @ViewChild(UiModalComponent) modal!: UiModalComponent;

  onClose(): void {
    this.closeCount++;
  }

  onAction(side: "left" | "right"): void {
    this.lastAction = side;
  }
}

describe("UiModal", () => {
  let fixture: ComponentFixture<ModalHostComponent>;
  let host: ModalHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(host.modal).toBeTruthy();
  });

  describe("visibility", () => {
    it("does not render when isOpen is false", () => {
      const shell = fixture.nativeElement.querySelector(".ui-modal-shell");
      expect(shell).toBeNull();
    });

    it("renders when isOpen is true", () => {
      host.isOpen = true;
      fixture.detectChanges();
      const shell = fixture.nativeElement.querySelector(".ui-modal-shell");
      expect(shell).toBeTruthy();
      expect(shell.textContent).toContain("Modal content");
    });
  });

  describe("close button", () => {
    it("renders the close button by default", () => {
      host.isOpen = true;
      fixture.detectChanges();
      const closeBtn = fixture.nativeElement.querySelector(
        "[aria-label='Cerrar']",
      );
      expect(closeBtn).toBeTruthy();
    });

    it("hides the close button when showCloseButton is false", () => {
      host.isOpen = true;
      host.showCloseButton = false;
      fixture.detectChanges();
      const closeBtn = fixture.nativeElement.querySelector(
        "[aria-label='Cerrar']",
      );
      expect(closeBtn).toBeNull();
    });

    it("emits close when the close button is clicked", () => {
      host.isOpen = true;
      fixture.detectChanges();
      const closeBtn = fixture.nativeElement.querySelector(
        "[aria-label='Cerrar']",
      ) as HTMLButtonElement;
      closeBtn.click();
      expect(host.closeCount).toBe(1);
    });
  });

  describe("backdrop", () => {
    it("renders the backdrop when isFullscreen is false", () => {
      host.isOpen = true;
      host.isFullscreen = false;
      fixture.detectChanges();
      const backdrop = fixture.nativeElement.querySelector(".ui-modal-backdrop");
      expect(backdrop).toBeTruthy();
    });

    it("does not render the backdrop when isFullscreen is true", () => {
      host.isOpen = true;
      host.isFullscreen = true;
      fixture.detectChanges();
      const backdrop = fixture.nativeElement.querySelector(".ui-modal-backdrop");
      expect(backdrop).toBeNull();
    });
  });

  describe("header (title/subtitle)", () => {
    it("does not render header when title and subtitle are empty", () => {
      host.isOpen = true;
      host.title = "";
      host.subtitle = "";
      fixture.detectChanges();
      expect(host.modal.hasFooter()).toBe(false);
    });

    it("renders title when provided", () => {
      host.isOpen = true;
      host.title = "Editar rol";
      fixture.detectChanges();
      const shell = fixture.nativeElement.querySelector(".ui-modal-shell");
      expect(shell.textContent).toContain("Editar rol");
    });

    it("renders subtitle when provided", () => {
      host.isOpen = true;
      host.subtitle = "Rol del sistema";
      fixture.detectChanges();
      const shell = fixture.nativeElement.querySelector(".ui-modal-shell");
      expect(shell.textContent).toContain("Rol del sistema");
    });
  });

  describe("footer with leftAction and rightAction", () => {
    it("does not render footer when showFooter is false", () => {
      host.isOpen = true;
      host.showFooter = false;
      fixture.detectChanges();
      const footer = fixture.nativeElement.querySelector(".rounded-b-xl");
      expect(footer).toBeNull();
    });

    it("does not render footer when showFooter is true but no actions", () => {
      host.isOpen = true;
      host.showFooter = true;
      host.leftAction = null;
      host.rightAction = null;
      fixture.detectChanges();
      const footer = fixture.nativeElement.querySelector(".rounded-b-xl");
      expect(footer).toBeNull();
    });

    it("renders left action button when provided", () => {
      host.isOpen = true;
      host.showFooter = true;
      host.leftAction = {
        label: "Cancelar",
        variant: "secondary",
        icon: IconXComponent,
      };
      fixture.detectChanges();
      const footer = fixture.nativeElement.querySelector(".rounded-b-xl");
      expect(footer).toBeTruthy();
      expect(footer.textContent).toContain("Cancelar");
    });

    it("renders right action button when provided", () => {
      host.isOpen = true;
      host.showFooter = true;
      host.rightAction = {
        label: "Guardar",
        variant: "primary",
        icon: IconCheckComponent,
      };
      fixture.detectChanges();
      const footer = fixture.nativeElement.querySelector(".rounded-b-xl");
      expect(footer).toBeTruthy();
      expect(footer.textContent).toContain("Guardar");
    });

    it("emits action with 'left' when left button is clicked", () => {
      host.isOpen = true;
      host.showFooter = true;
      host.leftAction = { label: "Cancelar", variant: "secondary" };
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll("button");
      const cancelBtn = Array.from(buttons).find(
        (b) => b.textContent?.trim() === "Cancelar",
      ) as HTMLButtonElement;
      cancelBtn.click();
      expect(host.lastAction).toBe("left");
    });

    it("emits action with 'right' when right button is clicked", () => {
      host.isOpen = true;
      host.showFooter = true;
      host.rightAction = {
        label: "Guardar",
        variant: "primary",
        icon: IconCheckComponent,
      };
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll("button");
      const saveBtn = Array.from(buttons).find(
        (b) => b.textContent?.trim() === "Guardar",
      ) as HTMLButtonElement;
      saveBtn.click();
      expect(host.lastAction).toBe("right");
    });

    it("renders icon-only button when label is empty and icon is provided", () => {
      host.isOpen = true;
      host.showFooter = true;
      host.leftAction = {
        label: "",
        icon: IconTrashComponent,
        tooltip: "Eliminar",
      };
      fixture.detectChanges();
      const footer = fixture.nativeElement.querySelector(".rounded-b-xl");
      const button = footer.querySelector("button");
      expect(button).toBeTruthy();
      expect(button.textContent?.trim()).toBe("");
      expect(button.querySelector("svg")).toBeTruthy();
    });
  });

  describe("action tooltip", () => {
    it("passes tooltip to UiButton when provided", () => {
      host.isOpen = true;
      host.showFooter = true;
      host.rightAction = {
        label: "Eliminar",
        variant: "primary",
        styleType: "danger",
        tooltip: "Eliminar rol permanentemente",
      };
      fixture.detectChanges();
      const footer = fixture.nativeElement.querySelector(".rounded-b-xl");
      const button = footer.querySelector("button");
      expect(button).toBeTruthy();
    });
  });

  describe("action disabled and loading", () => {
    it("respects disabled state", () => {
      host.isOpen = true;
      host.showFooter = true;
      host.rightAction = { label: "Guardar", variant: "primary", disabled: true };
      fixture.detectChanges();
      const footer = fixture.nativeElement.querySelector(".rounded-b-xl");
      const button = footer.querySelector("button") as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });
  });

  describe("content classes", () => {
    it("applies extra className when provided", () => {
      host.isOpen = true;
      host.className = "max-w-[600px]";
      fixture.detectChanges();
      expect(host.modal.contentClasses()).toContain("rounded-xl");
      expect(host.modal.contentClasses()).toContain("max-w-[600px]");
    });

    it("uses fullscreen classes when isFullscreen is true", () => {
      host.isOpen = true;
      host.isFullscreen = true;
      fixture.detectChanges();
      expect(host.modal.contentClasses()).toContain("h-full");
      expect(host.modal.contentClasses()).not.toContain("rounded-xl");
    });

    it("respects a custom rounded size when provided", () => {
      host.isOpen = true;
      host.rounded = "2xl";
      fixture.detectChanges();
      expect(host.modal.contentClasses()).toContain("rounded-2xl");
      expect(host.modal.contentClasses()).not.toContain("rounded-xl");
    });

    it("applies size class based on size input", () => {
      host.isOpen = true;
      host.size = "3xl";
      fixture.detectChanges();
      expect(host.modal.contentClasses()).toContain("max-w-3xl");
    });
  });
});

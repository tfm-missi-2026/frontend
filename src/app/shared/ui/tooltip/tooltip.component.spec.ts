import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiTooltipComponent } from "./tooltip.component";

describe("Tooltip", () => {
  let component: UiTooltipComponent;
  let fixture: ComponentFixture<UiTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTooltipComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should default to the light variant", () => {
    expect(component.variant()).toBe("light");
    expect(component.variantClass()).toContain("bg-white");
    expect(component.variantClass()).toContain("text-gray-800");
  });

  it("should update the variant classes when variant changes", async () => {
    fixture.componentRef.setInput("variant", "error");
    await fixture.whenStable();
    expect(component.variantClass()).toContain("bg-error-50");
    expect(component.variantClass()).toContain("text-error-900");
  });
});

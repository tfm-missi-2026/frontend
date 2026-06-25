import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';

import { UiTooltipComponent } from './tooltip.component';
import { ThemeService } from '@shared/services/theme.service';

describe('Tooltip', () => {
  let component: UiTooltipComponent;
  let fixture: ComponentFixture<UiTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTooltipComponent],
      providers: [Overlay, ThemeService],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTooltipComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to the light variant', () => {
    expect(component.variant()).toBe('light');
    expect(component.variantClasses()).toContain('bg-white');
    expect(component.variantClasses()).toContain('text-gray-800');
  });

  it('should update the variant classes when variant changes', async () => {
    fixture.componentRef.setInput('variant', 'error');
    await fixture.whenStable();
    expect(component.variantClasses()).toContain('bg-error-50');
    expect(component.variantClasses()).toContain('text-error-900');
  });

  it('should expose a stable tooltip id', () => {
    expect(component.tooltipId).toMatch(/^ui-tooltip-\d+$/);
  });
});

@Component({
  standalone: true,
  imports: [UiTooltipComponent],
  template: `
    <UiTooltip [content]="'hello'"></UiTooltip>
    <ng-template #tpl>rich content</ng-template>
  `,
})
class TooltipHostComponent {
  @ViewChild('tpl') tpl!: TemplateRef<unknown>;
}

describe('Tooltip integration', () => {
  it('renders the host trigger', () => {
    const fixture = TestBed.createComponent(TooltipHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('ui-tooltip');
    expect(host).toBeTruthy();
    expect(host.classList.contains('inline-block')).toBe(true);
  });
});
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiIconButtonComponent } from './icon-button';

@Component({
  selector: 'IconStub',
  standalone: true,
  template: `<svg data-testid="stub-svg" [attr.width]="size"></svg>`,
})
class IconStubComponent {
  @Input() size: number | string = 16;
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() color?: string;
  @Input() className?: string;
}

/**
 * Aplica inputs signal-based con `componentRef.setInput`. Signal-based
 * inputs son `InputSignal<T>` y no admiten asignación directa.
 */
function applyInputs<T>(
  fixture: ComponentFixture<T>,
  opts: Record<string, unknown>,
): void {
  const ref = fixture.componentRef as unknown as {
    setInput: (name: string, value: unknown) => void;
  };
  for (const [k, v] of Object.entries(opts)) {
    ref.setInput(k, v);
  }
}

describe('UiIconButtonComponent', () => {
  function buildFixture(
    opts: Record<string, unknown> = {},
  ): ComponentFixture<UiIconButtonComponent> {
    const fixture = TestBed.createComponent(UiIconButtonComponent);
    applyInputs(fixture, {
      Icon: IconStubComponent,
      labelText: 'iconic',
      ...opts,
    });
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiIconButtonComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = buildFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a square aspect-ratio button by default', () => {
    const fixture = buildFixture();
    const btn = fixture.nativeElement.querySelector(
      '[data-testid="icon-button"]',
    ) as HTMLButtonElement;
    expect(btn.className).toContain('aspect-square');
  });

  it('renders the Icon component inside the button', () => {
    const fixture = buildFixture();
    const svg = fixture.nativeElement.querySelector('[data-testid="stub-svg"]');
    expect(svg).not.toBeNull();
  });

  it('forwards aria-label from labelText', () => {
    const fixture = buildFixture({ labelText: 'custom label' });
    const btn = fixture.nativeElement.querySelector(
      '[data-testid="icon-button"]',
    ) as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('custom label');
  });

  it('emits (click) on click when enabled', () => {
    const fixture = buildFixture();
    let emitted = false;
    fixture.componentInstance.click.subscribe(() => (emitted = true));
    const btn = fixture.nativeElement.querySelector(
      '[data-testid="icon-button"]',
    ) as HTMLButtonElement;
    btn.click();
    expect(emitted).toBe(true);
  });

  it('does not emit (click) when disabled', () => {
    const fixture = buildFixture({ disabled: true });
    let emitted = false;
    fixture.componentInstance.click.subscribe(() => (emitted = true));
    const btn = fixture.nativeElement.querySelector(
      '[data-testid="icon-button"]',
    ) as HTMLButtonElement;
    btn.click();
    expect(emitted).toBe(false);
  });
});

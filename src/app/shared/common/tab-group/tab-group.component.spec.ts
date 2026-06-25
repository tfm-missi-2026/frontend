import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonTabGroupComponent } from './tab-group.component';

describe('CommonTabGroup', () => {
  let fixture: ComponentFixture<CommonTabGroupComponent>;
  let component: CommonTabGroupComponent;
  let native: HTMLElement;

  const threeTabs = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonTabGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonTabGroupComponent);
    component = fixture.componentInstance;
    native = fixture.nativeElement;
    fixture.componentRef.setInput('tabs', threeTabs);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders one button per tab', () => {
    const buttons = native.querySelectorAll('button');
    expect(buttons.length).toBe(3);
  });

  it('defaults to the first non-disabled tab in uncontrolled mode', () => {
    const buttons = native.querySelectorAll('button');
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons[1].getAttribute('aria-selected')).toBe('false');
    expect(buttons[2].getAttribute('aria-selected')).toBe('false');
  });

  it('emits selectedChange when clicking a non-disabled tab', () => {
    const spy = jasmine.createSpy('selectedChange');
    component.selectedChange.subscribe(spy);

    const buttons = native.querySelectorAll('button');
    (buttons[1] as HTMLButtonElement).click();
    expect(spy).toHaveBeenCalledWith('quarterly');
  });

  it('updates internal selection in uncontrolled mode on click', () => {
    const buttons = native.querySelectorAll('button');
    (buttons[2] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(buttons[0].getAttribute('aria-selected')).toBe('false');
    expect(buttons[1].getAttribute('aria-selected')).toBe('false');
    expect(buttons[2].getAttribute('aria-selected')).toBe('true');
  });

  it('does not change visual selection in controlled mode', () => {
    fixture.componentRef.setInput('selectedId', 'monthly');
    fixture.detectChanges();

    const spy = jasmine.createSpy('selectedChange');
    component.selectedChange.subscribe(spy);

    const buttons = native.querySelectorAll('button');
    (buttons[1] as HTMLButtonElement).click();

    expect(spy).toHaveBeenCalledWith('quarterly');
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons[1].getAttribute('aria-selected')).toBe('false');
  });

  it('does not emit when clicking a disabled tab', () => {
    fixture.componentRef.setInput('tabs', [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
      { value: 'c', label: 'C' },
    ]);
    fixture.detectChanges();

    const spy = jasmine.createSpy('selectedChange');
    component.selectedChange.subscribe(spy);

    const buttons = native.querySelectorAll('button');
    (buttons[1] as HTMLButtonElement).click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('uses roving tabindex pattern (0 on selected, -1 on others)', () => {
    const buttons = native.querySelectorAll('button');
    expect(buttons[0].getAttribute('tabindex')).toBe('0');
    expect(buttons[1].getAttribute('tabindex')).toBe('-1');
    expect(buttons[2].getAttribute('tabindex')).toBe('-1');
  });

  it('forwards ariaLabel to the tablist wrapper', () => {
    fixture.componentRef.setInput('ariaLabel', 'Select period');
    fixture.detectChanges();
    const list = native.querySelector('[role="tablist"]');
    expect(list?.getAttribute('aria-label')).toBe('Select period');
  });

  it('does not emit aria-label when ariaLabel is empty', () => {
    const list = native.querySelector('[role="tablist"]');
    expect(list?.getAttribute('aria-label')).toBeNull();
  });

  it('appends className to the container', () => {
    fixture.componentRef.setInput('className', 'mt-4');
    fixture.detectChanges();
    const list = native.querySelector('[role="tablist"]');
    expect(list?.className).toContain('mt-4');
    expect(list?.className).toContain('bg-gray-100');
  });

  it('falls back to first non-disabled tab when selectedId does not match', () => {
    fixture.componentRef.setInput('selectedId', 'non-existent');
    fixture.detectChanges();

    const buttons = native.querySelectorAll('button');
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
  });

  it('falls back to first non-disabled tab when selectedId points to a disabled tab', () => {
    fixture.componentRef.setInput('tabs', [
      { value: 'a', label: 'A', disabled: true },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
    ]);
    fixture.componentRef.setInput('selectedId', 'a');
    fixture.detectChanges();

    const buttons = native.querySelectorAll('button');
    expect(buttons[0].getAttribute('aria-selected')).toBe('false');
    expect(buttons[1].getAttribute('aria-selected')).toBe('true');
  });

  it('exposes effectiveSelected as a computed signal', () => {
    expect(component.effectiveSelected()).toBe('monthly');

    fixture.componentRef.setInput('selectedId', 'annually');
    fixture.detectChanges();
    expect(component.effectiveSelected()).toBe('annually');
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button';

/**
 * Crea un fixture fresco del `ButtonComponent` con los inputs
 * deseados. Esto evita los problemas de `OnPush` + asignación
 * directa de `@Input` (la cual no dispara CD sin `setInput`).
 */
function buildFixture(
  opts: Partial<ButtonComponent> & { label?: string } = {},
): ComponentFixture<ButtonComponent> {
  const fixture = TestBed.createComponent(ButtonComponent);
  const instance = fixture.componentInstance;
  // Aplicar defaults razonables si no se pasan
  instance.label = opts.label ?? 'Click me';
  Object.assign(instance, opts);
  fixture.detectChanges();
  return fixture;
}

describe('ButtonComponent', () => {
  it('should create', () => {
    const fixture = buildFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a <button> by default with type="button"', () => {
    const fixture = buildFixture();
    const btn = fixture.nativeElement.querySelector(
      '[data-testid="button"]',
    ) as HTMLButtonElement;
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.type).toBe('button');
  });

  it('renders type="submit" when isSubmit is true', () => {
    const fixture = buildFixture({ isSubmit: true });
    const btn = fixture.nativeElement.querySelector(
      '[data-testid="button"]',
    ) as HTMLButtonElement;
    expect(btn.type).toBe('submit');
  });

  it('applies the primary/default variant classes by default', () => {
    const fixture = buildFixture();
    const cls = (fixture.nativeElement.querySelector(
      '[data-testid="button"]',
    ) as HTMLElement).className;
    expect(cls).toContain('bg-brand-500');
    expect(cls).toContain('text-white');
  });

  it('switches to secondary variant classes when variant=secondary', () => {
    const fixture = buildFixture({ variant: 'secondary' });
    const cls = (fixture.nativeElement.querySelector(
      '[data-testid="button"]',
    ) as HTMLElement).className;
    expect(cls).toContain('bg-white');
    expect(cls).toContain('text-brand-500');
  });

  it('disables the button when disabled is true', () => {
    const fixture = buildFixture({ disabled: true });
    const btn = fixture.nativeElement.querySelector(
      '[data-testid="button"]',
    ) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('disables the button when isLoading is true', () => {
    const fixture = buildFixture({ isLoading: true });
    const btn = fixture.nativeElement.querySelector(
      '[data-testid="button"]',
    ) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('emits (click) with a MouseEvent when clicked', () => {
    const fixture = buildFixture();
    let emitted: MouseEvent | undefined;
    fixture.componentInstance.click.subscribe((e) => (emitted = e));
    const btn = fixture.nativeElement.querySelector(
      '[data-testid="button"]',
    ) as HTMLButtonElement;
    btn.click();
    expect(emitted).toBeDefined();
    expect(emitted).toBeInstanceOf(MouseEvent);
  });

  it('does NOT emit (click) when disabled', () => {
    const fixture = buildFixture({ disabled: true });
    let emitted = false;
    fixture.componentInstance.click.subscribe(() => (emitted = true));
    const btn = fixture.nativeElement.querySelector(
      '[data-testid="button"]',
    ) as HTMLButtonElement;
    btn.click();
    expect(emitted).toBe(false);
  });

  it('aria-label is forwarded from labelText', () => {
    const fixture = buildFixture({ labelText: 'Save record' });
    const btn = fixture.nativeElement.querySelector(
      '[data-testid="button"]',
    ) as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('Save record');
  });

  it('resetTimeout() is a public function', () => {
    const fixture = buildFixture();
    expect(typeof fixture.componentInstance.resetTimeout).toBe('function');
  });

  // ---------------------------------------------------------------------------
  // Timeout / progress bar
  // ---------------------------------------------------------------------------

  it('wraps the button in a LoadingTimeoutWrapper when timeout is set', () => {
    const fixture = buildFixture({ timeout: 5000 });
    const wrapper = fixture.nativeElement.querySelector(
      '[data-testid="loading-timeout-wrapper"]',
    );
    expect(wrapper).not.toBeNull();
  });

  it('shows the progress bar with the correct animation duration', () => {
    const fixture = buildFixture({ timeout: 5000 });
    const progress = fixture.nativeElement.querySelector(
      '.loading-timeout-wrapper__progress',
    ) as HTMLElement;
    expect(progress).not.toBeNull();
    expect(progress.style.animationDuration).toBe('5000ms');
  });

  it('does NOT render the progress bar when timeout is undefined', () => {
    const fixture = buildFixture();
    const progress = fixture.nativeElement.querySelector(
      '.loading-timeout-wrapper__progress',
    );
    expect(progress).toBeNull();
  });

  it('hides the inner button content via disabled:opacity-0 while runningTimeout', () => {
    const fixture = buildFixture({ timeout: 5000 });
    const btn = fixture.nativeElement.querySelector(
      '[data-testid="button"]',
    ) as HTMLButtonElement;
    // The inner button is effectively disabled → opacity-0 hides icon+label
    expect(btn.disabled).toBe(true);
    expect(btn.className).toContain('disabled:opacity-0');
  });

  it('keeps the button clickable while runningTimeout when disableOnTimeout is false', () => {
    const fixture = buildFixture({ timeout: 5000, disableOnTimeout: false });
    const btn = fixture.nativeElement.querySelector(
      '[data-testid="button"]',
    ) as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  it('resetTimeout() can be invoked and keeps the wrapper running', () => {
    const fixture = buildFixture({ timeout: 5000 });
    const wrapperBefore = fixture.nativeElement.querySelector(
      '[data-testid="loading-timeout-wrapper"]',
    );
    expect(wrapperBefore).not.toBeNull();

    fixture.componentInstance.resetTimeout();
    fixture.detectChanges();

    const wrapperAfter = fixture.nativeElement.querySelector(
      '[data-testid="loading-timeout-wrapper"]',
    );
    expect(wrapperAfter).not.toBeNull();
  });
});

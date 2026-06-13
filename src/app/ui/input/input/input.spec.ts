import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

import { InputComponent } from './input';

/**
 * Crea un fixture fresco del `InputComponent` con los inputs
 * deseados. Esto evita los problemas de `OnPush` + asignación
 * directa de `@Input` (la cual no dispara CD sin `setInput`).
 */
function buildFixture(
  opts: Partial<InputComponent> = {},
): ComponentFixture<InputComponent> {
  const fixture = TestBed.createComponent(InputComponent);
  const instance = fixture.componentInstance;
  Object.assign(instance, opts);
  fixture.detectChanges();
  return fixture;
}

describe('InputComponent', () => {
  it('should create', () => {
    const fixture = buildFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders an <input> with type="text" by default', () => {
    const fixture = buildFixture();
    const input = fixture.nativeElement.querySelector(
      '[data-testid="input"]',
    ) as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.type).toBe('text');
  });

  it('does NOT render the label when labelText is omitted', () => {
    const fixture = buildFixture();
    const label = fixture.nativeElement.querySelector('FormLabel');
    expect(label).toBeNull();
  });

  it('renders the FormLabel when labelText is provided', () => {
    const fixture = buildFixture({ labelText: 'Email', id: 'email' });
    const label = fixture.nativeElement.querySelector('FormLabel');
    expect(label).not.toBeNull();
  });

  it('disables the <input> when disabled is true', () => {
    const fixture = buildFixture({ disabled: true });
    const input = fixture.nativeElement.querySelector(
      '[data-testid="input"]',
    ) as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('sets readOnly on the <input> when readOnly is true', () => {
    const fixture = buildFixture({ readOnly: true });
    const input = fixture.nativeElement.querySelector(
      '[data-testid="input"]',
    ) as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });

  it('emits valueChange with the new value on input', () => {
    const fixture = buildFixture();
    let emitted: string | undefined;
    fixture.componentInstance.valueChange.subscribe((v) => (emitted = v));
    const input = fixture.nativeElement.querySelector(
      '[data-testid="input"]',
    ) as HTMLInputElement;
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    expect(emitted).toBe('hello');
  });

  it('emits enterKey when Enter is pressed', () => {
    const fixture = buildFixture();
    let emitted: KeyboardEvent | undefined;
    fixture.componentInstance.enterKey.subscribe((e) => (emitted = e));
    const input = fixture.nativeElement.querySelector(
      '[data-testid="input"]',
    ) as HTMLInputElement;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    input.dispatchEvent(event);
    expect(emitted).toBeDefined();
    expect(emitted?.key).toBe('Enter');
  });

  it('emits keyDown on any key press', () => {
    const fixture = buildFixture();
    let emitted: KeyboardEvent | undefined;
    fixture.componentInstance.keyDown.subscribe((e) => (emitted = e));
    const input = fixture.nativeElement.querySelector(
      '[data-testid="input"]',
    ) as HTMLInputElement;
    const event = new KeyboardEvent('keydown', { key: 'a' });
    input.dispatchEvent(event);
    expect(emitted).toBeDefined();
    expect(emitted?.key).toBe('a');
  });

  it('does NOT emit enterKey for non-Enter keys', () => {
    const fixture = buildFixture();
    let emitted = false;
    fixture.componentInstance.enterKey.subscribe(() => (emitted = true));
    const input = fixture.nativeElement.querySelector(
      '[data-testid="input"]',
    ) as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(emitted).toBe(false);
  });

  it('shows the ValidationErrorIcon when errorMessage is set', () => {
    const fixture = buildFixture({ errorMessage: 'Campo obligatorio' });
    const icon = fixture.nativeElement.querySelector(
      '[data-testid="input-error-icon"]',
    );
    expect(icon).not.toBeNull();
  });

  it('does NOT show the ValidationErrorIcon when errorMessage is empty', () => {
    const fixture = buildFixture();
    const icon = fixture.nativeElement.querySelector(
      '[data-testid="input-error-icon"]',
    );
    expect(icon).toBeNull();
  });

  it('updates charCount when value changes', () => {
    const fixture = buildFixture({ maxLength: 10 });
    const input = fixture.nativeElement.querySelector(
      '[data-testid="input"]',
    ) as HTMLInputElement;
    input.value = 'hola';
    input.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.charCount).toBe(4);
  });

  it('renders the charCount footer when maxLength is set', () => {
    const fixture = buildFixture({ maxLength: 10 });
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('0/10');
  });

  it('renders the legend when provided', () => {
    const fixture = buildFixture({ legend: 'Helper text' });
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Helper text');
  });

  it('reflects the controlled value in the <input>', () => {
    const fixture = buildFixture({ value: 'preset' });
    const input = fixture.nativeElement.querySelector(
      '[data-testid="input"]',
    ) as HTMLInputElement;
    expect(input.value).toBe('preset');
  });

  it('writeValue() updates the internal value', () => {
    const fixture = buildFixture();
    fixture.componentInstance.writeValue('from form');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      '[data-testid="input"]',
    ) as HTMLInputElement;
    expect(input.value).toBe('from form');
  });

  it('focusInput() focuses the <input>', () => {
    const fixture = buildFixture();
    const focusSpy = vi
      .spyOn(
        fixture.componentInstance.inputEl.nativeElement,
        'focus',
      )
      .mockImplementation(() => {});
    fixture.componentInstance.focusInput();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('prefix and sufix are rendered when provided', () => {
    const fixture = buildFixture({ prefix: '$', sufix: 'USD' });
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('$');
    expect(text).toContain('USD');
  });
});

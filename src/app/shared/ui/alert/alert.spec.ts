import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UiAlertComponent } from './alert';
import { AlertVariant } from './alert.types';

// ---------------------------------------------------------------------------
// Host component — los `input()` de UiAlert son read-only, así que el
// fixture directo no puede mutarlos. El host los pasa vía template binding.
// ---------------------------------------------------------------------------

@Component({
  standalone: true,
  imports: [UiAlertComponent],
  template: `
    <UiAlert
      [variant]="variant"
      [title]="title"
      [message]="message"
      [showLink]="showLink"
      [linkHref]="linkHref"
      [linkText]="linkText"
    />
  `,
})
class AlertHostComponent {
  variant: AlertVariant = 'info';
  title = '';
  message = '';
  showLink = false;
  linkHref = '#';
  linkText = 'Learn more';

  @ViewChild(UiAlertComponent) alert!: UiAlertComponent;
}

// ---------------------------------------------------------------------------

describe('UiAlert', () => {
  let fixture: ComponentFixture<AlertHostComponent>;
  let host: AlertHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertHostComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(host.alert).toBeTruthy();
  });

  it('uses the info variant by default', () => {
    expect(host.alert.variant()).toBe('info');
    expect(host.alert.config().iconClass).toContain('blue-light-500');
  });

  it('picks the success palette for variant="success"', () => {
    host.variant = 'success';
    fixture.detectChanges();
    expect(host.alert.config().container).toContain('success-500');
    expect(host.alert.config().iconClass).toContain('success-500');
  });

  it('picks the error palette for variant="error"', () => {
    host.variant = 'error';
    fixture.detectChanges();
    expect(host.alert.config().container).toContain('error-500');
    expect(host.alert.config().iconClass).toContain('error-500');
  });

  it('picks the warning palette for variant="warning"', () => {
    host.variant = 'warning';
    fixture.detectChanges();
    expect(host.alert.config().container).toContain('warning-500');
    expect(host.alert.config().iconClass).toContain('warning-500');
  });

  it('renders title and message when provided', () => {
    host.title = 'Heads up';
    host.message = 'Something happened.';
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Heads up');
    expect(root.textContent).toContain('Something happened.');
  });

  it('hides the link when showLink is false', () => {
    host.showLink = false;
    host.linkText = 'Read more';
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a');
    expect(link).toBeNull();
  });

  it('renders the link with the given text and href when showLink is true', () => {
    host.showLink = true;
    host.linkHref = '/docs';
    host.linkText = 'Read the docs';
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector(
      'a',
    ) as HTMLAnchorElement | null;
    expect(link).toBeTruthy();
    expect(link?.textContent?.trim()).toBe('Read the docs');
  });
});

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiModalComponent } from './modal';

@Component({
  standalone: true,
  imports: [UiModalComponent],
  template: `
    <UiModal
      [isOpen]="isOpen"
      [className]="className"
      [showCloseButton]="showCloseButton"
      [isFullscreen]="isFullscreen"
      (close)="onClose()"
    >
      <p>Modal content</p>
    </UiModal>
  `,
})
class ModalHostComponent {
  isOpen = false;
  className = '';
  showCloseButton = true;
  isFullscreen = false;
  closeCount = 0;

  @ViewChild(UiModalComponent) modal!: UiModalComponent;

  onClose(): void {
    this.closeCount++;
  }
}

describe('UiModal', () => {
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

  it('should create', () => {
    expect(host.modal).toBeTruthy();
  });

  it('does not render anything when isOpen is false', () => {
    const modalRoot = fixture.nativeElement.querySelector('.modal');
    expect(modalRoot).toBeNull();
  });

  it('renders the modal when isOpen is true', () => {
    host.isOpen = true;
    fixture.detectChanges();
    const modalRoot = fixture.nativeElement.querySelector('.modal');
    expect(modalRoot).toBeTruthy();
    expect(modalRoot.textContent).toContain('Modal content');
  });

  it('renders the close button by default', () => {
    host.isOpen = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('hides the close button when showCloseButton is false', () => {
    host.isOpen = true;
    host.showCloseButton = false;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeNull();
  });

  it('emits close when the close button is clicked', () => {
    host.isOpen = true;
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    expect(host.closeCount).toBe(1);
  });

  it('renders the backdrop when isFullscreen is false', () => {
    host.isOpen = true;
    host.isFullscreen = false;
    fixture.detectChanges();
    const backdrop = fixture.nativeElement.querySelector('.backdrop-blur-\\[32px\\]');
    expect(backdrop).toBeTruthy();
  });

  it('does not render the backdrop when isFullscreen is true', () => {
    host.isOpen = true;
    host.isFullscreen = true;
    fixture.detectChanges();
    const backdrop = fixture.nativeElement.querySelector('.backdrop-blur-\\[32px\\]');
    expect(backdrop).toBeNull();
  });

  it('applies contentClasses with extra className when provided', () => {
    host.isOpen = true;
    host.className = 'max-w-[600px] p-5';
    fixture.detectChanges();
    expect(host.modal.contentClasses()).toContain('rounded-3xl');
    expect(host.modal.contentClasses()).toContain('max-w-[600px]');
  });

  it('uses fullscreen classes when isFullscreen is true', () => {
    host.isOpen = true;
    host.isFullscreen = true;
    fixture.detectChanges();
    expect(host.modal.contentClasses()).toContain('h-full');
    expect(host.modal.contentClasses()).not.toContain('rounded-3xl');
  });
});

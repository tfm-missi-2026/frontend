import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingTimeoutWrapperComponent } from './loading-timeout-wrapper';

describe('LoadingTimeoutWrapper', () => {
  let component: LoadingTimeoutWrapperComponent;
  let fixture: ComponentFixture<LoadingTimeoutWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingTimeoutWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingTimeoutWrapperComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hides the progress bar when `timeout` is undefined', () => {
    fixture.componentRef.setInput('timeout', undefined);
    fixture.detectChanges();
    const progress = fixture.nativeElement.querySelector(
      '.loading-timeout-wrapper__progress',
    );
    expect(progress).toBeNull();
  });

  it('renders the progress bar when `timeout` is set', () => {
    fixture.componentRef.setInput('timeout', 5000);
    fixture.detectChanges();
    const progress = fixture.nativeElement.querySelector(
      '.loading-timeout-wrapper__progress',
    );
    expect(progress).not.toBeNull();
    expect(progress.style.animationDuration).toBe('5000ms');
  });
});

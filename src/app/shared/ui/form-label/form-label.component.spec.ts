import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFormLabelComponent } from './form-label';

describe('FormLabel', () => {
  let component: UiFormLabelComponent;
  let fixture: ComponentFixture<UiFormLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiFormLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiFormLabelComponent);
    component = fixture.componentInstance;
    // Signal-based inputs son `InputSignal<T>` (read-only). Hay que
    // usar `componentRef.setInput` en vez de asignación directa.
    fixture.componentRef.setInput('labelText', 'Email');
    fixture.componentRef.setInput('labelFor', 'email');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

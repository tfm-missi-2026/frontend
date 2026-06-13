import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLabelComponent } from './form-label';

describe('FormLabel', () => {
  let component: FormLabelComponent;
  let fixture: ComponentFixture<FormLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormLabelComponent);
    component = fixture.componentInstance;
    component.labelText = 'Email';
    component.labelFor = 'email';
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

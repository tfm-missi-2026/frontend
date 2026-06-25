import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiLabelComponent } from './label.component';

describe('Label', () => {
  let component: UiLabelComponent;
  let fixture: ComponentFixture<UiLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiLabelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

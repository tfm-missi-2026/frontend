import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCheckboxComponent } from './checkbox';

describe('Checkbox', () => {
  let component: UiCheckboxComponent;
  let fixture: ComponentFixture<UiCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCheckboxComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

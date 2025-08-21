import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentControl } from './appointment-control';

describe('AppointmentControl', () => {
  let component: AppointmentControl;
  let fixture: ComponentFixture<AppointmentControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

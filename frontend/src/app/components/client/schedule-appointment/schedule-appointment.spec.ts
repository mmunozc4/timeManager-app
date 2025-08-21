import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAppointment } from './schedule-appointment';

describe('ScheduleAppointment', () => {
  let component: ScheduleAppointment;
  let fixture: ComponentFixture<ScheduleAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleAppointment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesDashboard } from './employees-dashboard';

describe('EmployeesDashboard', () => {
  let component: EmployeesDashboard;
  let fixture: ComponentFixture<EmployeesDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

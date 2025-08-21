import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDashboard } from './services-dashboard';

describe('ServicesDashboard', () => {
  let component: ServicesDashboard;
  let fixture: ComponentFixture<ServicesDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateService } from './rate-service';

describe('RateService', () => {
  let component: RateService;
  let fixture: ComponentFixture<RateService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

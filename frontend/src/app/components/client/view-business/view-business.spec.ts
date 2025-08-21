import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBusiness } from './view-business';

describe('ViewBusiness', () => {
  let component: ViewBusiness;
  let fixture: ComponentFixture<ViewBusiness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBusiness]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBusiness);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

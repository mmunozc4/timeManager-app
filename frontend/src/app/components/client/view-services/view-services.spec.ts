import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServices } from './view-services';

describe('ViewServices', () => {
  let component: ViewServices;
  let fixture: ComponentFixture<ViewServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAppointmennt } from './list-appointmennt';

describe('ListAppointmennt', () => {
  let component: ListAppointmennt;
  let fixture: ComponentFixture<ListAppointmennt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAppointmennt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAppointmennt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

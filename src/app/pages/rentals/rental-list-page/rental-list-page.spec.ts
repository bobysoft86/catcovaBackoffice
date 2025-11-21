import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalListPage } from './rental-list-page';

describe('RentalListPage', () => {
  let component: RentalListPage;
  let fixture: ComponentFixture<RentalListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

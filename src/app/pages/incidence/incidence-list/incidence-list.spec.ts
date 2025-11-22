import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenceList } from './incidence-list';

describe('IncidenceList', () => {
  let component: IncidenceList;
  let fixture: ComponentFixture<IncidenceList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidenceList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidenceList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

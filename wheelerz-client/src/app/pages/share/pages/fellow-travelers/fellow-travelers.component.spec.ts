import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FellowTravelersComponent } from './fellow-travelers.component';

describe('FellowTravelersComponent', () => {
  let component: FellowTravelersComponent;
  let fixture: ComponentFixture<FellowTravelersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FellowTravelersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FellowTravelersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

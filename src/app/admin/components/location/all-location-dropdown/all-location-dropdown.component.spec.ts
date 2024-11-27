import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLocationDropdownComponent } from './all-location-dropdown.component';

describe('AllLocationDropdownComponent', () => {
  let component: AllLocationDropdownComponent;
  let fixture: ComponentFixture<AllLocationDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllLocationDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllLocationDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

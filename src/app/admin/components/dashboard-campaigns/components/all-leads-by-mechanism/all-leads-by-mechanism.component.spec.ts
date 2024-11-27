import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLeadsByMechanismComponent } from './all-leads-by-mechanism.component';

describe('AllLeadsByMechanismComponent', () => {
  let component: AllLeadsByMechanismComponent;
  let fixture: ComponentFixture<AllLeadsByMechanismComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllLeadsByMechanismComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllLeadsByMechanismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

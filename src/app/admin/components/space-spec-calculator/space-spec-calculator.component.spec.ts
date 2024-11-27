import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceSpecCalculatorComponent } from './space-spec-calculator.component';

describe('SpaceSpecCalculatorComponent', () => {
  let component: SpaceSpecCalculatorComponent;
  let fixture: ComponentFixture<SpaceSpecCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceSpecCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceSpecCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

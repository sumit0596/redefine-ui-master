import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtProgrammeComponent } from './debt-programme.component';

describe('DebtProgrammeComponent', () => {
  let component: DebtProgrammeComponent;
  let fixture: ComponentFixture<DebtProgrammeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtProgrammeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtProgrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressOfficeDetailsComponent } from './press-office-details.component';

describe('PressOfficeDetailsComponent', () => {
  let component: PressOfficeDetailsComponent;
  let fixture: ComponentFixture<PressOfficeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PressOfficeDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PressOfficeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

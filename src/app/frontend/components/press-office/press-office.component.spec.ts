import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressOfficeComponent } from './press-office.component';

describe('PressOfficeComponent', () => {
  let component: PressOfficeComponent;
  let fixture: ComponentFixture<PressOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PressOfficeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PressOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

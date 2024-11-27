import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensDetailsComponent } from './sens-details.component';

describe('SensDetailsComponent', () => {
  let component: SensDetailsComponent;
  let fixture: ComponentFixture<SensDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurOfficesComponent } from './our-offices.component';

describe('OurOfficesComponent', () => {
  let component: OurOfficesComponent;
  let fixture: ComponentFixture<OurOfficesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurOfficesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurOfficesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

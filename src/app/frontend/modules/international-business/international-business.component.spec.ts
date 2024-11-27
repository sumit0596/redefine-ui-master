import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalBusinessComponent } from './international-business.component';

describe('InternationalBusinessComponent', () => {
  let component: InternationalBusinessComponent;
  let fixture: ComponentFixture<InternationalBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternationalBusinessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

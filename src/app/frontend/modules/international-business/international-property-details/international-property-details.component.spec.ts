import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalPropertyDetailsComponent } from './international-property-details.component';

describe('InternationalPropertyDetailsComponent', () => {
  let component: InternationalPropertyDetailsComponent;
  let fixture: ComponentFixture<InternationalPropertyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternationalPropertyDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalPropertyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

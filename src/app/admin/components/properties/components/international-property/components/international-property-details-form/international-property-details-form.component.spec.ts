import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalPropertyDetailsFormComponent } from './international-property-details-form.component';

describe('InternationalPropertyDetailsFormComponent', () => {
  let component: InternationalPropertyDetailsFormComponent;
  let fixture: ComponentFixture<InternationalPropertyDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternationalPropertyDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalPropertyDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

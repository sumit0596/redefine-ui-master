import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalPropertyFeaturesFormComponent } from './international-property-features-form.component';

describe('InternationalPropertyFeaturesFormComponent', () => {
  let component: InternationalPropertyFeaturesFormComponent;
  let fixture: ComponentFixture<InternationalPropertyFeaturesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternationalPropertyFeaturesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalPropertyFeaturesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

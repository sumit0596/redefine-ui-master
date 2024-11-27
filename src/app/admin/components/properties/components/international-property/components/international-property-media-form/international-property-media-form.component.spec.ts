import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalPropertyMediaFormComponent } from './international-property-media-form.component';

describe('InternationalPropertyMediaFormComponent', () => {
  let component: InternationalPropertyMediaFormComponent;
  let fixture: ComponentFixture<InternationalPropertyMediaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternationalPropertyMediaFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalPropertyMediaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

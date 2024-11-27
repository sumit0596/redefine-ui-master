import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalSeoFormComponent } from './international-seo-form.component';

describe('InternationalSeoFormComponent', () => {
  let component: InternationalSeoFormComponent;
  let fixture: ComponentFixture<InternationalSeoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternationalSeoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalSeoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

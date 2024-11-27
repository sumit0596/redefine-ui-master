import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeoFormComponent } from './seo-form.component';

describe('SeoFormComponent', () => {
  let component: SeoFormComponent;
  let fixture: ComponentFixture<SeoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

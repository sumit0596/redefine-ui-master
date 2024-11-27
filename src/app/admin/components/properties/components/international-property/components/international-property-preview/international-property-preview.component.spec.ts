import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalPropertyPreviewComponent } from './international-property-preview.component';

describe('InternationalPropertyPreviewComponent', () => {
  let component: InternationalPropertyPreviewComponent;
  let fixture: ComponentFixture<InternationalPropertyPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternationalPropertyPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalPropertyPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

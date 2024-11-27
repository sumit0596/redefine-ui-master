import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceAnalyticsComponent } from './source-analytics.component';

describe('SourceAnalyticsComponent', () => {
  let component: SourceAnalyticsComponent;
  let fixture: ComponentFixture<SourceAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceAnalyticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

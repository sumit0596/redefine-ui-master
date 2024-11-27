import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightAnalyticsComponent } from './insight-analytics.component';

describe('InsightAnalyticsComponent', () => {
  let component: InsightAnalyticsComponent;
  let fixture: ComponentFixture<InsightAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsightAnalyticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

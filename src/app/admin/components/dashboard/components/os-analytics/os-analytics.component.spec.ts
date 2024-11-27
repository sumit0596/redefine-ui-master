import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsAnalyticsComponent } from './os-analytics.component';

describe('OsAnalyticsComponent', () => {
  let component: OsAnalyticsComponent;
  let fixture: ComponentFixture<OsAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OsAnalyticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OsAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

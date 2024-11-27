import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnalyticsComponent } from './browser-analytics.component';

describe('BrowserAnalyticsComponent', () => {
  let component: BrowserAnalyticsComponent;
  let fixture: ComponentFixture<BrowserAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowserAnalyticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowserAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

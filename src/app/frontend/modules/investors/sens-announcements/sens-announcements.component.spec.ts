import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensAnnouncementsComponent } from './sens-announcements.component';

describe('SensAnnouncementsComponent', () => {
  let component: SensAnnouncementsComponent;
  let fixture: ComponentFixture<SensAnnouncementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensAnnouncementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensAnnouncementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

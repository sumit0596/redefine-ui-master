import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensAnnouncementsDialogComponent } from './sens-announcements-dialog.component';

describe('SensAnnouncementsDialogComponent', () => {
  let component: SensAnnouncementsDialogComponent;
  let fixture: ComponentFixture<SensAnnouncementsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensAnnouncementsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensAnnouncementsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignLeadsDialogComponent } from './campaign-leads-dialog.component';

describe('CampaignLeadsDialogComponent', () => {
  let component: CampaignLeadsDialogComponent;
  let fixture: ComponentFixture<CampaignLeadsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignLeadsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignLeadsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

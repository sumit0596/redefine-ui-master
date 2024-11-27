import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignDataTableComponent } from './campaign-data-table.component';

describe('CampaignDataTableComponent', () => {
  let component: CampaignDataTableComponent;
  let fixture: ComponentFixture<CampaignDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CampaignDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

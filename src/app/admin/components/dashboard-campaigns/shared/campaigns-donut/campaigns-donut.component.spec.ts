import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsDonutComponent } from './campaigns-donut.component';

describe('CampaignsDonutComponent', () => {
  let component: CampaignsDonutComponent;
  let fixture: ComponentFixture<CampaignsDonutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignsDonutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignsDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

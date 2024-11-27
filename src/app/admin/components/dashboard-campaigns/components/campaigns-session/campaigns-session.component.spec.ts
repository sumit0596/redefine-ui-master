import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsSessionComponent } from './campaigns-session.component';

describe('CampaignsSessionComponent', () => {
  let component: CampaignsSessionComponent;
  let fixture: ComponentFixture<CampaignsSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignsSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignsSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

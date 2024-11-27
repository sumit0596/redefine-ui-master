import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerStakeholdersComponent } from './broker-stakeholders.component';

describe('BrokerStakeholdersComponent', () => {
  let component: BrokerStakeholdersComponent;
  let fixture: ComponentFixture<BrokerStakeholdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerStakeholdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerStakeholdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerCommissionIncentivesFormComponent } from './broker-commission-incentives-form.component';

describe('BrokerCommissionIncentivesFormComponent', () => {
  let component: BrokerCommissionIncentivesFormComponent;
  let fixture: ComponentFixture<BrokerCommissionIncentivesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerCommissionIncentivesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerCommissionIncentivesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

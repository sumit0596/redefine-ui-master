import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerProfileFormComponent } from './broker-profile-form.component';

describe('BrokerProfileFormComponent', () => {
  let component: BrokerProfileFormComponent;
  let fixture: ComponentFixture<BrokerProfileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerProfileFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

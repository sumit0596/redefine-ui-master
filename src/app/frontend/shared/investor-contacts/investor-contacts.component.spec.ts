import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorContactsComponent } from './investor-contacts.component';

describe('InvestorContactsComponent', () => {
  let component: InvestorContactsComponent;
  let fixture: ComponentFixture<InvestorContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestorContactsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

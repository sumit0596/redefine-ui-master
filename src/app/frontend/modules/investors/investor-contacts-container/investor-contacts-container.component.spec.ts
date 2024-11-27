import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorContactsContainerComponent } from './investor-contacts-container.component';

describe('InvestorContactsContainerComponent', () => {
  let component: InvestorContactsContainerComponent;
  let fixture: ComponentFixture<InvestorContactsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestorContactsContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorContactsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorsContactsListComponent } from './investors-contacts-list.component';

describe('InvestorsContactsListComponent', () => {
  let component: InvestorsContactsListComponent;
  let fixture: ComponentFixture<InvestorsContactsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestorsContactsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorsContactsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

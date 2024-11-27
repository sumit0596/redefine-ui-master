import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantIncentivesFormComponent } from './tenant-incentives-form.component';

describe('TenantIncentivesFormComponent', () => {
  let component: TenantIncentivesFormComponent;
  let fixture: ComponentFixture<TenantIncentivesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantIncentivesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantIncentivesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

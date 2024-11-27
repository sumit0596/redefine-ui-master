import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEsgComponent } from './manage-esg.component';

describe('ManageEsgComponent', () => {
  let component: ManageEsgComponent;
  let fixture: ComponentFixture<ManageEsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEsgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

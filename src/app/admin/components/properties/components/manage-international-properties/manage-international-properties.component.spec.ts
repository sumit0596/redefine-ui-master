import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInternationalPropertiesComponent } from './manage-international-properties.component';

describe('ManageInternationalPropertiesComponent', () => {
  let component: ManageInternationalPropertiesComponent;
  let fixture: ComponentFixture<ManageInternationalPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageInternationalPropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageInternationalPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

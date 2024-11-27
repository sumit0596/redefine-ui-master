import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePropertyEqTagComponent } from './manage-property-eq-tag.component';

describe('ManagePropertyEqTagComponent', () => {
  let component: ManagePropertyEqTagComponent;
  let fixture: ComponentFixture<ManagePropertyEqTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePropertyEqTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePropertyEqTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

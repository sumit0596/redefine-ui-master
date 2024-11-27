import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePropertyEqComponent } from './manage-property-eq.component';

describe('ManagePropertyEqComponent', () => {
  let component: ManagePropertyEqComponent;
  let fixture: ComponentFixture<ManagePropertyEqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePropertyEqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePropertyEqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

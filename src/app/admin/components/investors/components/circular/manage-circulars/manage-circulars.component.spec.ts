import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCircularsComponent } from './manage-circulars.component';

describe('ManageCircularsComponent', () => {
  let component: ManageCircularsComponent;
  let fixture: ComponentFixture<ManageCircularsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCircularsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCircularsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

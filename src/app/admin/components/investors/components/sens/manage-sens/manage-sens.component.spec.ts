import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSensComponent } from './manage-sens.component';

describe('ManageSensComponent', () => {
  let component: ManageSensComponent;
  let fixture: ComponentFixture<ManageSensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

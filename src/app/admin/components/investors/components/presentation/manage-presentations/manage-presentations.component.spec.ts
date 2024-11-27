import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePresentationsComponent } from './manage-presentations.component';

describe('ManagePresentationsComponent', () => {
  let component: ManagePresentationsComponent;
  let fixture: ComponentFixture<ManagePresentationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePresentationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePresentationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

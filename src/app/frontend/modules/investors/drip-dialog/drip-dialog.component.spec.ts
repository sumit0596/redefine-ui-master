import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DripDialogComponent } from './drip-dialog.component';

describe('DripDialogComponent', () => {
  let component: DripDialogComponent;
  let fixture: ComponentFixture<DripDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DripDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DripDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnGroupDialogComponent } from './column-group-dialog.component';

describe('ColumnGroupDialogComponent', () => {
  let component: ColumnGroupDialogComponent;
  let fixture: ComponentFixture<ColumnGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnGroupDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

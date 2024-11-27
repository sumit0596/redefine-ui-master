import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleDialogComponent } from './people-dialog.component';

describe('PeopleDialogComponent', () => {
  let component: PeopleDialogComponent;
  let fixture: ComponentFixture<PeopleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

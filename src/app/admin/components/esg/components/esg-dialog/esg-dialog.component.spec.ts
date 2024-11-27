import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsgDialogComponent } from './esg-dialog.component';

describe('EsgDialogComponent', () => {
  let component: EsgDialogComponent;
  let fixture: ComponentFixture<EsgDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsgDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

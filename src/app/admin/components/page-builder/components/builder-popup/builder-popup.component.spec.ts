import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderPopupComponent } from './builder-popup.component';

describe('BuilderPopupComponent', () => {
  let component: BuilderPopupComponent;
  let fixture: ComponentFixture<BuilderPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuilderPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

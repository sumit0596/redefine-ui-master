import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressReleaseFormComponent } from './press-release-form.component';

describe('PressReleaseFormComponent', () => {
  let component: PressReleaseFormComponent;
  let fixture: ComponentFixture<PressReleaseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PressReleaseFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PressReleaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

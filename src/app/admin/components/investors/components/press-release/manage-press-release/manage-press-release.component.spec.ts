import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePressReleaseComponent } from './manage-press-release.component';

describe('ManagePressReleaseComponent', () => {
  let component: ManagePressReleaseComponent;
  let fixture: ComponentFixture<ManagePressReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePressReleaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePressReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaFormComponent } from './media-form.component';

describe('MediaFormComponent', () => {
  let component: MediaFormComponent;
  let fixture: ComponentFixture<MediaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

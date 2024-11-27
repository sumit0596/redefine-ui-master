import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensFormComponent } from './sens-form.component';

describe('SensFormComponent', () => {
  let component: SensFormComponent;
  let fixture: ComponentFixture<SensFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

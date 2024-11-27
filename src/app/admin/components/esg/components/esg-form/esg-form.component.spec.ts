import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsgFormComponent } from './esg-form.component';

describe('EsgFormComponent', () => {
  let component: EsgFormComponent;
  let fixture: ComponentFixture<EsgFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsgFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsgFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

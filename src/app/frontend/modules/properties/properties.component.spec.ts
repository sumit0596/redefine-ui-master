import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendPropertiesComponent } from './properties.component';

describe('FrontendPropertiesComponent', () => {
  let component: FrontendPropertiesComponent;
  let fixture: ComponentFixture<FrontendPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrontendPropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontendPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

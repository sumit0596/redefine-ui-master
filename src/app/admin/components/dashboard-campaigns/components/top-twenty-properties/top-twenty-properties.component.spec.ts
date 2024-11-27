import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTwentyPropertiesComponent } from './top-twenty-properties.component';

describe('TopTwentyPropertiesComponent', () => {
  let component: TopTwentyPropertiesComponent;
  let fixture: ComponentFixture<TopTwentyPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopTwentyPropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopTwentyPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

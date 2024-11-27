import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTwentyLeasingExecutiveComponent } from './top-twenty-leasing-executive.component';

describe('TopTwentyLeasingExecutiveComponent', () => {
  let component: TopTwentyLeasingExecutiveComponent;
  let fixture: ComponentFixture<TopTwentyLeasingExecutiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopTwentyLeasingExecutiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopTwentyLeasingExecutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

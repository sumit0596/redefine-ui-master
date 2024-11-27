import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeContentCarousalComponent } from './home-content-carousal.component';

describe('HomeContentCarousalComponent', () => {
  let component: HomeContentCarousalComponent;
  let fixture: ComponentFixture<HomeContentCarousalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeContentCarousalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeContentCarousalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedPropertiesCarouselComponent } from './featured-properties-carousel.component';

describe('FeaturedPropertiesCarouselComponent', () => {
  let component: FeaturedPropertiesCarouselComponent;
  let fixture: ComponentFixture<FeaturedPropertiesCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturedPropertiesCarouselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedPropertiesCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

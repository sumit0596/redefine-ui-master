import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTE } from 'src/app/models/constants';
import { FrontendService } from '../../services/frontend.service';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { CommonModule } from '@angular/common';
import { FeatureCardComponent } from '../feature-card/feature-card.component';
import { FePropertiesService } from 'src/app/admin/services/fe-properties.service';

@Component({
  selector: 'app-featured-properties-carousel',
  standalone: true,
  templateUrl: './featured-properties-carousel.component.html',
  styleUrls: ['./featured-properties-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FeatureCardComponent],
})
export class FeaturedPropertiesCarouselComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  propertyType: any;
  sliderProperties: any;
  currentIndex = 0;
  showPrevious: boolean = false;
  showNext: boolean = false;

  // NEW IMPLEMENTATION
  featuredPropertyList!: any[];
  slider!: KeenSliderInstance;
  currentSlide: number = 1;
  dotHelper: Array<Number> = [];
  @ViewChild('sliderRef') sliderRef!: ElementRef<HTMLElement>;

  constructor(
    // private feproperties: FePropertiesService,
    private router: Router,
    private route: ActivatedRoute,
    private frontendService: FrontendService,
    private cd: ChangeDetectorRef,
    private feProperties: FePropertiesService
  ) {}
  ngOnDestroy(): void {
    if (this.slider) this.slider.destroy();
  }

  ngOnInit() {
    this.propertyType = this.route.parent?.snapshot.data['propertyType'];
  }
  ngAfterViewInit(): void {
    this.getFeaturedProperties();
  }

  getFeaturedProperties() {
    this.frontendService.getFeaturedProperties(this.propertyType).subscribe({
      next: (data: any) => {
        this.featuredPropertyList = data;
        this.initCarousel();
      },
      error: (err: any) => {},
    });
  }
  initCarousel() {
    setTimeout(() => {
      this.slider = new KeenSlider(
        this.sliderRef.nativeElement,
        {
          loop: true,
          initial: this.currentSlide,
          renderMode: 'performance',
          slides: { perView: 1 },
          slideChanged: (s: any) => {
            this.currentSlide = s.track.details.rel;
          },
          breakpoints: {
            '(min-width: 420px)': {
              slides: { perView: 1, spacing: 5 },
            },
            '(min-width: 768px)': {
              slides: { perView: 2, spacing: 5 },
            },
            '(min-width: 1000px)': {
              slides: { perView: 3, spacing: 10 },
            },
          },
        },
        [
          (slider: any) => {
            let timeout: any;
            let mouseOver = false;
            function clearNextTimeout() {
              clearTimeout(timeout);
            }
            function nextTimeout() {
              clearTimeout(timeout);
              if (mouseOver) return;
              timeout = setTimeout(() => {
                slider.next();
              }, 3000);
            }
            slider.on('created', () => {
              slider.container.addEventListener('mouseover', () => {
                mouseOver = true;
                clearNextTimeout();
              });
              slider.container.addEventListener('mouseout', () => {
                mouseOver = false;
                nextTimeout();
              });
              nextTimeout();
            });
            slider.on('dragStarted', clearNextTimeout);
            slider.on('animationEnded', nextTimeout);
            slider.on('updated', nextTimeout);
          },
        ]
      );
      this.dotHelper = [
        ...Array(this.slider.track.details.slides.length).keys(),
      ];
    }, 0);
  }
  preview(event: any) {
    if (this.propertyType == 2) {
      this.router.navigate([
        ROUTE.FRONTEND_INTERNATIONAL_PROPERTY_DETAILS,
        event.Slug,
      ]);
    } else {
      this.router.navigate([ROUTE.FRONTEND_SA_PROPERTIES, event.Slug]);
      this.feProperties.setDefaultTab(0);
    }
  }
}

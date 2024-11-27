import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { interval } from 'rxjs';
import { CanonicalService } from 'src/app/shared/services/canonical.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrls: [
    '../../../../../node_modules/keen-slider/keen-slider.min.css',
    './home-page.component.scss',
  ],
  imports: [CommonModule],
})
export class HomePageComponent {
  @ViewChild('sliderRef') sliderRef!: ElementRef<HTMLElement>;
  @ViewChild('titleSliderRef') titleSliderRef!: ElementRef<HTMLElement>;
  images: String[] = [
    'https://images.unsplash.com/photo-1590004953392-5aba2e72269a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&h=500&w=800&q=80',
    'https://images.unsplash.com/photo-1590004845575-cc18b13d1d0a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&h=500&w=800&q=80',
    'https://images.unsplash.com/photo-1590004987778-bece5c9adab6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&h=500&w=800&q=80',
    'https://images.unsplash.com/photo-1590005176489-db2e714711fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&h=500&w=800&q=80',
  ];
  contents: any[] = [
    {
      Image:
        'https://redefinedataplatform.blob.core.windows.net/corporate-website-live-images/Media-1710223641-rdp-230525-20015-new-website-elements-support-may-23-010-ew-v1-alice-lane-1.jpg',
      Content: 'Office properties',
      Description: 'We offer world class',
      ButtonTitle: 'Learn More',
      ButtonLink: '/properties',
    },
    {
      Image:
        'https://redefinedataplatform.blob.core.windows.net/corporate-website-live-images/Media-1710224375-rdp-230525-20015-new-website-elements-support-may-23-010-ew-v1-blue-route-mall-1.jpg',
      Content: 'Retail properties',
      Description: 'We offer world class',
      ButtonTitle: 'Learn More',
      ButtonLink: '/properties',
    },
    {
      Image:
        'https://redefinedataplatform.blob.core.windows.net/corporate-website-live-images/Media-1710224430-rdp-230525-20015-new-website-elements-support-may-23-010-ew-v1-190-barbra-rd-2.jpg',
      Content: 'Industrial properties',
      Description: 'We offer world class',
      ButtonTitle: 'Learn More',
      ButtonLink: '/properties',
    },
  ];
  opacities: number[] = [];
  slider!: KeenSliderInstance;
  titleSlider!: KeenSliderInstance;
  slideInterval: any = interval(5000);
  ngAfterViewInit() {
    setTimeout(() => {
      this.slider = new KeenSlider(this.sliderRef.nativeElement, {
        slides: this.images.length,
        loop: true,
        defaultAnimation: {
          duration: 3000,
        },
        created: (s) => {
          this.slideInterval.subscribe(() => {
            s.next();
          });
        },
        detailsChanged: (s) => {
          this.opacities = s.track.details.slides.map((slide) => slide.portion);
        },
      });
      this.titleSlider = new KeenSlider(this.titleSliderRef.nativeElement, {
        loop: true,
        slides: {
          origin: 'center',
          perView: 1,
          spacing: 10,
        },
        vertical: true,
        created: (s) => {
          this.slideInterval.subscribe(() => {
            s.next();
          });
        },
      });
    });
  }

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    if (this.slider) {
      this.slider.destroy();
    }
  }
}

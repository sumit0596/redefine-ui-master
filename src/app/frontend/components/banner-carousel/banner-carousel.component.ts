import { Component, AfterViewInit, OnInit, Inject } from '@angular/core';
import { FrontendService } from '../../services/frontend.service';
import { CommonModule, DOCUMENT, NgOptimizedImage } from '@angular/common';
import { Observable, of } from 'rxjs';
import { COMPONENT } from 'src/app/models/custom-components';
import { Router, RouterModule, UrlTree } from '@angular/router';

@Component({
  selector: 'app-banner-carousel',
  standalone: true,
  templateUrl: './banner-carousel.component.html',
  styleUrls: ['./banner-carousel.component.scss'],
  imports: [CommonModule, NgOptimizedImage, RouterModule],
})
export class BannerCarouselComponent implements AfterViewInit, OnInit {
  sliderList: any[] = [];
  sliderList$!: Observable<any[]>;
  private intervalId: any;

  constructor(
    private frontendService: FrontendService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  imgNumber: number = 0;

  ngOnInit(): void {
    this.getHomeSlider();
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    this.stopAutoSlide();
  }
  startAutoSlide(): void {
    // Adjust the interval duration as needed (e.g., 5000 milliseconds for 5 seconds)
    this.intervalId = setInterval(() => {
      this.slideRight();
    }, 5000); // Change this value to adjust the interval duration
  }

  stopAutoSlide(): void {
    // Clear the interval when needed (e.g., when the component is destroyed)
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  getHomeSlider(): void {
    this.frontendService
      .getHomeSlider(COMPONENT.HOME_BANNER_CAROUSEL)
      .subscribe({
        next: (result: any) => {
          this.sliderList = result;
          this.sliderList$ = of(result);
        },
        error: (error: any) => {},
      });
  }
  ngAfterViewInit(): void {
    this.startAutoSlide();
  }

  slideRight(): void {
    this.hideAllSlides();
    this.imgNumber++;
    if (this.imgNumber === this.sliderList.length) {
      this.imgNumber = 0;
    }
    this.showSlide(this.imgNumber);
  }

  slideLeft(): void {
    this.hideAllSlides();
    this.imgNumber--;
    if (this.imgNumber === -1) {
      this.imgNumber = this.sliderList.length - 1;
    }
    this.showSlide(this.imgNumber);
  }

  hideAllSlides(): void {
    this.sliderList.forEach((slide, index) => {
      let slideElement: HTMLElement | null = document.querySelector(
        `#slide_${index}`
      );
      if (slideElement) {
        slideElement.style.display = 'none';
      }
    });
  }

  showSlide(index: number): void {
    let slideElement: HTMLElement | null = document.querySelector(
      `#slide_${index}`
    );
    if (slideElement) {
      slideElement.style.display = 'block';
    }
  }
  goToSlide(index: number): void {
    this.hideAllSlides();
    this.imgNumber = index;
    this.showSlide(this.imgNumber);
  }

  scrollTo25Percent() {
    const totalHeight =
      this.document.documentElement.scrollHeight -
      this.document.documentElement.clientHeight;
    const targetScrollHeight = totalHeight * 0.3;
    this.document.documentElement.scrollTop = targetScrollHeight;
  }
  navigate(link: string) {
    const urlTree: UrlTree = this.router.parseUrl(link || '');
    let url: string = link.includes('?') ? link.split('?')[0] : link;
    if (link.includes('?')) {
      this.router.navigate([url], { queryParams: urlTree.queryParams });
    } else {
      this.router.navigate([url]);
    }
  }
}

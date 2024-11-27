import { Component, AfterViewInit, OnInit, Inject, Input } from '@angular/core';
import { FrontendService } from '../../services/frontend.service';
import { CommonModule, DOCUMENT, NgOptimizedImage } from '@angular/common';
import { Observable, of } from 'rxjs';
import { COMPONENT } from 'src/app/models/custom-components';
import { Router, RouterModule, UrlTree } from '@angular/router';

@Component({
  selector: 'app-custom-carousel',
  standalone: true,
  templateUrl: './custom-carousel.component.html',
  styleUrls: ['./custom-carousel.component.scss'],
  imports: [CommonModule, NgOptimizedImage, RouterModule],
})
export class CustomCarouselComponent implements AfterViewInit, OnInit {
  sliderList1: any[] = [];
  sliderList1$!: Observable<any[]>;
  private intervalId: any;
  @Input() id!: string;
  constructor(
    private frontendService: FrontendService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  imgNumber1: number = 0;

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
      this.slideRight1();
    }, 5000); // Change this value to adjust the interval duration
  }

  stopAutoSlide(): void {
    // Clear the interval when needed (e.g., when the component is destroyed)
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  getHomeSlider(): void {
    this.frontendService.getHomeSlider(this.id).subscribe({
      next: (result: any) => {
        this.sliderList1 = result;
        this.sliderList1$ = of(result);
      },
      error: (error: any) => {},
    });
  }
  ngAfterViewInit(): void {
    this.startAutoSlide();
  }

  slideRight1(): void {
    this.hideAllSlides1();
    this.imgNumber1++;
    if (this.imgNumber1 === this.sliderList1.length) {
      this.imgNumber1 = 0;
    }
    this.showSlide1(this.imgNumber1);
  }

  slideLeft1(): void {
    this.hideAllSlides1();
    this.imgNumber1--;
    if (this.imgNumber1 === -1) {
      this.imgNumber1 = this.sliderList1.length - 1;
    }
    this.showSlide1(this.imgNumber1);
  }

  hideAllSlides1(): void {
    this.sliderList1.forEach((slide, index) => {
      let slide1Element: HTMLElement | null = document.querySelector(
        `#slide_${index}`
      );
      if (slide1Element) {
        slide1Element.style.display = 'none';
      }
    });
  }

  showSlide1(index: number): void {
    let slide1Element: HTMLElement | null = document.querySelector(
      `#slide_${index}`
    );
    if (slide1Element) {
      slide1Element.style.display = 'block';
    }
  }
  goToSlide1(index: number): void {
    this.hideAllSlides1();
    this.imgNumber1 = index;
    this.showSlide1(this.imgNumber1);
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

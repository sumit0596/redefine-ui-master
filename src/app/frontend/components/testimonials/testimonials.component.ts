import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-testimonials',
  standalone: true,
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
  imports: [CommonModule],
})
export class TestimonialsComponent implements AfterViewInit, OnDestroy {
  slides = [
    {
      testimonial: 'We offer outstanding Properties',
    },
    {
      testimonial: 'Bucatini',
    },
    // Add more slide objects as needed
  ];

  imgNumber: number = 0;
  private subscription: Subscription;

  constructor() {
    this.subscription = new Subscription();
  }
  ngAfterViewInit(): void {
    this.initSlider();
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  private initSlider(): void {
    let sliderRight: HTMLElement = document.querySelector('#right_slider')!;
    sliderRight.addEventListener('click', () => this.slideRight());

    let sliderLeft: HTMLElement | null = document.querySelector('#left_slider');
    if (sliderLeft) {
      sliderLeft.addEventListener('click', () => this.slideLeft());
    } else {
      console.error("Element with ID 'left_slider' not found.");
    }
  }

  private startAutoplay(): void {
    // Set the interval duration in milliseconds (e.g., 3000ms for 3 seconds)
    const intervalDuration = 6000;

    // Use the interval service to create an observable that emits values at a specified interval
    this.subscription = interval(intervalDuration).subscribe(() => {
      this.slideRight();
    });
  }

  private stopAutoplay(): void {
    // Unsubscribe from the interval to stop autoplay when the component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private slideRight(): void {
    this.hideAllSlides();
    this.imgNumber++;
    if (this.imgNumber === this.slides.length) {
      this.imgNumber = 0;
    }
    this.showSlide(this.imgNumber);
  }

  private slideLeft(): void {
    this.hideAllSlides();
    this.imgNumber--;
    if (this.imgNumber === -1) {
      this.imgNumber = this.slides.length - 1;
    }
    this.showSlide(this.imgNumber);
  }

  goToSlide(index: number): void {
    this.hideAllSlides();
    this.imgNumber = index;
    this.showSlide(this.imgNumber);
  }

  private hideAllSlides(): void {
    this.slides.forEach((slide, index) => {
      let slideElement: HTMLElement | null = document.querySelector(
        `#slide_${index}`
      );
      if (slideElement) {
        slideElement.classList.remove('active');
      }
    });
  }

  private showSlide(index: number): void {
    let slideElement: HTMLElement | null = document.querySelector(
      `#slide_${index}`
    );
    if (slideElement) {
      slideElement.classList.add('active');
    }
  }
}

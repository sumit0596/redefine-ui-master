import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-home-content-carousal',
  standalone: true,
  templateUrl: './home-content-carousal.component.html',
  styleUrls: ['./home-content-carousal.component.scss'],
  imports: [CommonModule],
})
export class HomeContentCarousalComponent implements AfterViewInit, OnDestroy {
  sliders = [
    {
      image: '/assets/images/dashboard/contentcarousel.png',
      title: 'We offer outstanding Properties',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
    },
    {
      image: '/assets/images/dashboard/contentcarousel.png',
      title: 'We offer outstanding Properties 2',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
    },
    // Add more slide objects as needed
  ];

  imgNumber1: number = 0;
  private subscription: Subscription;

  constructor() {
    this.subscription = new Subscription();
  }
  ngAfterViewInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  private startAutoplay(): void {
    // Set the interval duration in milliseconds (e.g., 3000ms for 3 seconds)
    const intervalDuration = 5000;

    // Use the interval service to create an observable that emits values at a specified interval
    this.subscription = interval(intervalDuration).subscribe(() => {
      this.sliderRight();
    });
  }

  private stopAutoplay(): void {
    // Unsubscribe from the interval to stop autoplay when the component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private sliderRight(): void {
    this.hideAllsliders();
    this.imgNumber1++;
    if (this.imgNumber1 === this.sliders.length) {
      this.imgNumber1 = 0;
    }
    this.showSlider(this.imgNumber1);
  }

  goToSlide(index: number): void {
    this.hideAllsliders();
    this.imgNumber1 = index;
    this.showSlider(this.imgNumber1);
  }

  private hideAllsliders(): void {
    this.sliders.forEach((slide, index) => {
      let sliderElement: HTMLElement | null = document.querySelector(
        `#slide_${index}`
      );
      if (sliderElement) {
        sliderElement.classList.remove('active1');
      }
    });
  }

  private showSlider(index: number): void {
    let slideElement: HTMLElement | null = document.querySelector(
      `#slide_${index}`
    );
    if (slideElement) {
      slideElement.classList.add('active1');
    }
  }
}

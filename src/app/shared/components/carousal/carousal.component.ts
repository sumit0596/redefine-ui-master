import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Subject, interval, takeUntil } from 'rxjs';

@Component({
  selector: 'rd-carousal',
  standalone: true,
  templateUrl: './carousal.component.html',
  styleUrls: ['./carousal.component.scss'],
  imports: [CommonModule],
})
export class CarousalComponent {
  slideWidth: number = 100;
  currentSlide: number = 0;

  @Input() images: string[] = [];
  @Input() autoplay: boolean = false; // Set to false if you want to disable autoplay and true to enable
  @Input() autoplayInterval: number = 5000; // Adjust the autoplay interval (in milliseconds)

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    // this.slideWidth = 100; // Adjust the slide width based on the screen size
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Move to the next slide
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  // Move to the previous slide
  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.images.length) % this.images.length;
  }
  // Method to navigate to a specific slide
  goToSlide(index: number) {
    this.currentSlide = index;
  }
  // Start autoplay
  private startAutoplay() {
    interval(this.autoplayInterval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.nextSlide();
      });
  }
}

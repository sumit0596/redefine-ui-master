import { Component, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { trigger, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import KeenSlider, { KeenSliderInstance, KeenSliderPlugin } from 'keen-slider';

function ThumbnailPlugin(main: KeenSliderInstance): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove('active');
      });
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add('active');
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener('click', () => {
          main.moveToIdx(idx);
        });
      });
    }

    slider.on('created', () => {
      addActive(slider.track.details.rel);
      addClickEvents();
      main.on('animationStarted', (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
      });
    });
  };
}

@Component({
  selector: 'app-carousel-dialog',
  standalone: true,
  templateUrl: './carousel-dialog.component.html',
  styleUrls: ['./carousel-dialog.component.scss'],
  imports: [CommonModule],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(2000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class CarouselDialogComponent {
  @ViewChild('sliderRef') sliderRef!: ElementRef<HTMLElement>;
  @ViewChild('thumbnailRef') thumbnailRef!: ElementRef<HTMLElement>;

  slider!: KeenSliderInstance;
  thumbnailSlider!: KeenSliderInstance;
  sliderImages: any = [];
  base64Image!: string;
  currentIndex!: number;
  currentSlide: number = 0;
  dotHelper: Array<Number> = [];
  selectedImage: string = '';
  selectedImageIndex: number = 0;

  constructor(
    public dialogRef: MatDialogRef<CarouselDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.sliderImages = this.data.images;
    this.currentIndex = this.data.startIndex || 0;
    this.currentSlide = this.currentIndex;
  }

  ngAfterViewInit() {
    this.slider = new KeenSlider(this.sliderRef.nativeElement, {
      initial: this.currentIndex,
      renderMode: 'performance',
      slides: { perView: 1 },
      slideChanged: (s: any) => {
        this.currentSlide = s.track.details.rel;
      },
      created: (s: any) => {
        // setTimeout(() => {
        //   s.moveToIdx(this.currentIndex);
        // }, 1000);
      },
    });
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy();
    if (this.thumbnailSlider) this.thumbnailSlider.destroy();
  }

  close() {
    this.dialogRef.close();
  }
}

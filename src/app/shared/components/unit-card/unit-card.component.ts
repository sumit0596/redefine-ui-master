import { CommonModule, DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SECTOR } from 'src/app/models/sector';

@Component({
  selector: 'app-unit-card',
  standalone: true,
  templateUrl: './unit-card.component.html',
  styleUrls: ['./unit-card.component.scss'],
  imports: [CommonModule],
})
export class UnitCardComponent implements AfterViewInit {
  sector: any = SECTOR;

  @Input('unitDetails') unitDetails: any;
  @Input('propertyDetails') propertyDetails: any;
  @Input('propertyType') propertyType: any;

  @Output() unitPreviewPage: EventEmitter<any> = new EventEmitter<any>();
  @Output() propertyPreviewPage: EventEmitter<any> = new EventEmitter<any>();
  @Output() spaceSpec: EventEmitter<any> = new EventEmitter<any>();

  imagePlaceholder: string = 'assets/images/property-default-image.jpg';

  constructor(private router: Router, private decimalPipe : DecimalPipe, private el: ElementRef) {
  }

  ngOnInit(){
    if(this.unitDetails != undefined){
      this.unitDetails.GrossRental = this.decimalPipe.transform(this.unitDetails?.GrossRental)?.replaceAll(',', ' ');
      this.unitDetails.UnitSize =  this.decimalPipe.transform(this.unitDetails?.UnitSize)?.replaceAll(',', ' ');
      }
  }

  ngAfterViewInit() {
    const incentiveBtn = document.querySelector('.incentive-btn');
    const incentiveSection = document.querySelector('.incentive-section');
    
    if (incentiveBtn && incentiveSection) {
      incentiveBtn.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          incentiveSection.classList.add('show');
        }
      });
    }
  }

  incentiveSectionToggle(event: Event) {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    const incentiveSection = target.closest('.property-card')?.querySelector('.incentive-section');
    if (incentiveSection) {
      incentiveSection.classList.toggle('show');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const incentiveSection = this.el.nativeElement.querySelector('.incentive-section.show');
    if (incentiveSection && !this.el.nativeElement.contains(event.target)) {
      incentiveSection.classList.remove('show');
    }
  }

  unitPreview() {
    if (this.propertyType == 2 || this.propertyType == 1) {
      this.propertyPreviewPage.emit(this.propertyDetails);
    } else {
      this.unitPreviewPage.emit(this.unitDetails);
    }
  }

  space2SpecPage(event: MouseEvent) {
    event?.stopPropagation();
    this.spaceSpec.emit();
  }
}

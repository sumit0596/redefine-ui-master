import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SECTOR } from 'src/app/models/sector';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'rd-feature-card',
  standalone: true,
  templateUrl: './feature-card.component.html',
  styleUrls: ['./feature-card.component.scss'],
  imports: [CommonModule, NgOptimizedImage, SharedModule],
})
export class FeatureCardComponent {
  @Input('unit') unit: any;
  @Input('property') property: any;
  @Input('propertyType') propertyType: any;

  @Output() unitPreviewPage: EventEmitter<any> = new EventEmitter<any>();
  @Output() propertyPreviewPage: EventEmitter<any> = new EventEmitter<any>();

  sector = SECTOR
  imagePlaceholder: string = 'assets/images/property-default-image.webp';

  unitPreview() {
    this.propertyPreviewPage.emit(this.property);
  }

  getSectorColor(sector: string) {
    switch (sector.toUpperCase()) {
      case SECTOR.OFFICE.toUpperCase():
      case SECTOR.COMMERCIAL.toUpperCase():
        return '#017D67';
      case SECTOR.INDUSTRIAL.toUpperCase():
        return '#5C676D';
      case SECTOR.RETAIL.toUpperCase():
        return '#004B6A';
      case SECTOR.SPECIALISED.toUpperCase():
        return '#555d8b';
      default:
        return '#017D67';
    }
  }
}

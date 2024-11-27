import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUnit } from 'src/app/admin/models/interfaces';
import { SECTOR } from 'src/app/models/sector';

@Component({
  selector: 'rd-unit-card',
  templateUrl: './unit-card.component.html',
  styleUrls: ['./unit-card.component.scss'],
})
export class UnitCardComponent {
  @Input('unitDetails') unitDetails: any;
  @Output() unitPreviewPage: EventEmitter<any> = new EventEmitter<any>();
  imagePlaceholder: string = 'assets/images/property-default-image.jpg';

  constructor(private decimalPipe : DecimalPipe) {
  }

  ngOnInit(){
    if(this.unitDetails != undefined){
      this.unitDetails.GrossRental = this.decimalPipe.transform(this.unitDetails?.GrossRental)?.replaceAll(',', ' ');
      this.unitDetails.UnitSize =  this.decimalPipe.transform(this.unitDetails?.UnitSize)?.replaceAll(',', ' ');
      }
  }

  unitPreview() {
    this.unitPreviewPage.emit(this.unitDetails);
  }
  getSectorColor(sector: string | any) {
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

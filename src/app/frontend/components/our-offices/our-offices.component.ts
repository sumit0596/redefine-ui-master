import { Component, OnDestroy, OnInit } from '@angular/core';
import { FrontendService } from '../../services/frontend.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MapModule } from 'src/app/shared/modules/map/map.module';
import { MarkerConfig } from 'src/app/interfaces/map';

@Component({
  selector: 'app-our-offices',
  standalone: true,
  templateUrl: './our-offices.component.html',
  styleUrls: ['./our-offices.component.scss'],
  imports: [CommonModule, MapModule],
})
export class OurOfficesComponent implements OnInit, OnDestroy {
  offices$!: Observable<any[]>;
  officeList!: any[];
  markers: MarkerConfig[] = [];

  destroy$: Subject<void> = new Subject<void>();

  constructor(private frontendService: FrontendService) {}
  ngOnDestroy(): void {
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getOffices();
  }
  getOffices() {
    this.offices$ = this.frontendService.getOffices();
    this.offices$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.officeList = res;
        this.mapInit();
      },
    });
  }

  mapInit(): void {
    this.markers = this.officeList.map((office: any, index: number) => {
      return {
        ...office,
        label: office.Name,
        position: { lat: office.Latitude, lng: office.Longitude },
        style: { height: 35, width: 35 },
        content: `
        <div class="map-info-container" style="width: 250px">
         <p class="rd-text-grey-mid mb-1"><small>${office.Address1}</small></p>
         <h4 class="rd-heading rd-heading-xs">${office.Name}</h4>
         <p><small>${office.Address2}</small></p>
        </div>`,
      };
    });
  }
  highlightMarker(office: any, i: number) {
    this.markers = this.markers.map((office: any, index: number) => {
      return {
        ...office,
        active: index === i,
      };
    });
  }
}

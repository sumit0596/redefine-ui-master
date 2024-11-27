import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MarkerClusterer, MarkerUtils } from '@googlemaps/markerclusterer';
import { ToastrService } from 'ngx-toastr';
import { MarkerConfig, MarkerStyle } from 'src/app/interfaces/map';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {
  @Input() mapId: string = 'redefine-property-map';
  @Input() width: string = '100%';
  @Input() height: string = '350px';
  @Input() center!: google.maps.LatLngLiteral | any;
  @Input() zoom: number | any = 1;
  @Input() markers: MarkerConfig[] = [];
  @Input() markerOptions: google.maps.MarkerOptions = {};
  @Input() directionBtn: boolean = false;
  @Input() markerClusterer: boolean = false;

  @ViewChild('map') mapElement!: ElementRef;

  @Output() markerEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() infoWindowEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() zoomEvent: EventEmitter<any> = new EventEmitter<any>();

  map!: google.maps.Map;
  markerBounds!: google.maps.LatLngBounds;
  markerList!: google.maps.marker.AdvancedMarkerElement[];
  infoWindows: google.maps.InfoWindow[] = [];
  origin!: google.maps.LatLngLiteral;
  destination!: google.maps.LatLngLiteral;
  mousePosition!: google.maps.LatLngLiteral | undefined;

  loader: boolean = false;
  loadingMessage!: String;
  zoomActive: boolean = false;

  constructor(private toaster: ToastrService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markers'] && !changes['markers']?.isFirstChange()) {
      this.addMarkersToMap();
    }
    if (changes['center'] && !changes['center']?.isFirstChange()) {
      this.setCenter();
    }
    if (changes['zoom'] && !changes['zoom']?.isFirstChange()) {
      this.setZoom();
    }
  }

  ngOnInit(): void {
    this.initMap();
  }

  async initMap() {
    const { Map } = (await google.maps.importLibrary(
      'maps'
    )) as google.maps.MapsLibrary;

    this.map = new Map(this.mapElement.nativeElement, {
      center: this.center ? this.center : null,
      zoom: this.zoom,
      mapId: this.mapId,
    });
    this.map.addListener('zoom_changed', (event: any) => {
      this.zoomActive = false;
      this.zoom = this.map.getZoom();
      this.zoomEvent.emit({
        zoom: this.map.getZoom(),
        position: this.mousePosition,
      });
    });
    this.map.addListener('mousemove', (event: google.maps.MapMouseEvent) => {
      this.mousePosition = event.latLng?.toJSON();
    });
    this.map.addListener('mouseout', (event: google.maps.MapMouseEvent) => {
      this.mousePosition = undefined;
    });
    if (this.directionBtn) {
      this.plotButtonsOnMap();
    }
    await this.addMarkersToMap();
  }
  async addMarkersToMap() {
    this.removeAllMarkers();
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary;

    const { LatLngBounds } = (await google.maps.importLibrary(
      'core'
    )) as google.maps.CoreLibrary;

    this.markerBounds = new LatLngBounds();
    this.markerList = this.markers.map(
      (markerInfo: MarkerConfig, index: number) => {
        const svgEl = this.getPinSvgEle(markerInfo.style, markerInfo.count);
        const marker = new AdvancedMarkerElement({
          map: this.map,
          position: new google.maps.LatLng(
            markerInfo.position.lat,
            markerInfo.position.lng
          ),
          title: markerInfo.title,
          content: svgEl,
          zIndex: markerInfo.count ? +1 : undefined,
        });
        if (markerInfo.active) {
          this.setInfoWindow(marker, markerInfo);
        }
        // Add a click listener for each marker, and set up the info window.
        marker.addListener('click', ({ domEvent, latLng }: any) => {
          this.mousePosition = latLng?.toJSON();
          this.destination = markerInfo.position;
          this.center = markerInfo.position;
          if (markerInfo.content) {
            this.setInfoWindow(marker, markerInfo);
          }
          this.markerEvent.emit({
            markerInfo: markerInfo,
            position: this.mousePosition,
          });
        });
        if (this.markers?.length > 1 && !this.center) {
          this.markerBounds.extend(
            new google.maps.LatLng(
              markerInfo.position.lat,
              markerInfo.position.lng
            )
          );
        }
        return marker;
      }
    );
    // Add a marker clusterer to manage the markers.
    if (this.markerClusterer) {
      this.addMarkerClusterer();
    }
    // Zoom out the map to display all the markers in a view
    if (this.markers?.length >= 1) {
      if (this.markers?.length == 1) {
        this.center = null;
      }
      this.center = this.center ? this.center : this.markers[0].position;
      this.setCenter();
      // this.map.fitBounds(this.markerBounds);
    }
  }
  setCenter() {
    if (this.center) {
      this.map?.setCenter(
        new google.maps.LatLng(
          parseFloat(this.center.lat),
          parseFloat(this.center.lng)
        )
      );
    }
  }
  setZoom() {
    if (this.zoom) {
      this.map?.setZoom(this.zoom);
    }
  }
  removeAllMarkers() {
    // this.center = undefined;
    this.markerList?.forEach(
      (marker: google.maps.marker.AdvancedMarkerElement) => {
        marker.map = null;
      }
    );
    this.markerList = [];
  }
  private addMarkerClusterer() {
    new MarkerClusterer({
      map: this.map,
      markers: this.markerList,
      renderer: {
        render: ({ count, position }, stats, map) => {
          // create cluster SVG element
          const svgEl = this.getPinSvgEle(null, count);
          // adjust zIndex to be above other markers
          const zIndex = Number(google.maps.Marker.MAX_ZINDEX) + count;
          if (MarkerUtils.isAdvancedMarkerAvailable(map)) {
            svgEl.setAttribute('transform', 'translate(0 10)');
            const clusterOptions: google.maps.marker.AdvancedMarkerElementOptions =
              {
                map,
                position,
                zIndex,
                content: svgEl,
              };
            return new google.maps.marker.AdvancedMarkerElement(clusterOptions);
          }
          const clusterOptions = {
            position,
            zIndex,
            icon: {
              url: this.getPinSvgEle().innerText,
              anchor: new google.maps.Point(25, 25),
            },
          };
          return new google.maps.Marker(clusterOptions);
        },
      },
    });
  }
  private async setInfoWindow(
    marker: google.maps.marker.AdvancedMarkerElement,
    markerConfig: MarkerConfig
  ) {
    this.closeAllInfoWindow();
    const { InfoWindow } = (await google.maps.importLibrary(
      'maps'
    )) as google.maps.MapsLibrary;
    const infoWindow = new InfoWindow();
    var infoWindowContentBox = document.createElement('div');
    infoWindowContentBox.id = 'info-window-container';
    infoWindowContentBox.innerHTML = markerConfig.content
      ? markerConfig.content
      : '';
    infoWindow.close();
    infoWindow.setOptions({});
    infoWindow.setContent(infoWindowContentBox);
    if (markerConfig.active) {
      infoWindow.open(marker.map, marker);
      this.infoWindows.push(infoWindow);
    }
    infoWindow.open(marker.map, marker);
    this.infoWindows.push(infoWindow);
    google.maps.event.addListener(infoWindow, 'domready', () => {
      infoWindowContentBox.addEventListener('click', (event: any) => {
        if (event.target.tagName === 'BUTTON') {
          this.closeAllInfoWindow();
          this.infoWindowEvent.emit(markerConfig);
        }
      });
    });
  }
  private closeAllInfoWindow() {
    this.infoWindows.forEach((infoWindow: google.maps.InfoWindow) => {
      infoWindow.close();
    });
  }
  private getDirection() {
    this.loadingMessage = 'Loading...';
    this.loader = true;
    this.loadingMessage = 'Getting current location...';
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        if (position) {
          this.origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.renderDirection();
        } else {
          this.loader = false;
        }
      },
      (error: GeolocationPositionError) => {
        this.loader = false;
        if (error.code === 1) {
          this.toaster.error('Please enable location');
        }
      }
    );
  }
  renderDirection() {
    this.loadingMessage = 'Finding route...';
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    if (this.destination) {
      directionsService
        .route({
          origin: this.origin,
          destination: this.destination,
          travelMode: google.maps.TravelMode.WALKING,
        })
        .then((res: google.maps.DirectionsResult) => {
          this.loadingMessage = 'Almost there...';
          this.loader = false;
          directionsRenderer.setMap(this.map);
          directionsRenderer.setDirections(res);
        })
        .finally(() => {
          this.loader = false;
        });
    } else {
      this.loader = false;
      this.toaster.error('Please select marker on map');
    }
  }
  plotButtonsOnMap() {
    const centerControlDiv = document.createElement('div');
    const centerControl = this.createCenterControl();

    // Append the control to the DIV.
    centerControlDiv.appendChild(centerControl);
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].insertAt(
      0,
      centerControlDiv
    );
  }
  private createCenterControl() {
    const controlButton = document.createElement('button');
    // Set CSS for the control.
    controlButton.style.backgroundColor = '#fff';
    controlButton.style.border = '2px solid #fff';
    controlButton.style.borderRadius = '3px';
    controlButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlButton.style.color = 'rgb(25,25,25)';
    controlButton.style.cursor = 'pointer';
    controlButton.style.fontFamily = 'DIN,Arial,sans-serif';
    controlButton.style.fontSize = '16px';
    controlButton.style.lineHeight = '38px';
    controlButton.style.margin = '0 10px 20px';
    controlButton.style.padding = '0 5px';
    controlButton.style.height = '40px';
    controlButton.style.width = '40px';
    controlButton.style.textAlign = 'center';
    controlButton.innerHTML = `<span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#666" viewBox="0 0 256 256"><path d="M216.49,88.49l-48,48a12,12,0,0,1-17-17L179,92H76V224a12,12,0,0,1-24,0V80A12,12,0,0,1,64,68H179L151.51,40.49a12,12,0,1,1,17-17l48,48A12,12,0,0,1,216.49,88.49Z"></path></svg></svg></span>`;
    controlButton.title = 'Get directions';
    controlButton.type = 'button';
    // Setup the click event listeners.
    controlButton.addEventListener('click', () => {
      this.getDirection();
    });
    return controlButton;
  }
  private getPinSvgEle(
    style?: MarkerStyle | null,
    label: string | number = ''
  ) {
    const svg: string = `<svg width="${
      style?.width ? style?.width : '45'
    }" height="${
      style?.height ? style?.height : '45'
    }" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_7480_1802)">
    <path d="M30 3.75C24.5318 3.7562 19.2894 5.93118 15.4228 9.79777C11.5562 13.6644 9.3812 18.9068 9.375 24.375C9.375 42.0234 28.125 55.3523 28.9242 55.9102C29.2395 56.131 29.6151 56.2495 30 56.2495C30.3849 56.2495 30.7605 56.131 31.0758 55.9102C31.875 55.3523 50.625 42.0234 50.625 24.375C50.6188 18.9068 48.4438 13.6644 44.5772 9.79777C40.7106 5.93118 35.4682 3.7562 30 3.75ZM30 16.875C31.4834 16.875 32.9334 17.3149 34.1668 18.139C35.4001 18.9631 36.3614 20.1344 36.9291 21.5049C37.4968 22.8753 37.6453 24.3833 37.3559 25.8382C37.0665 27.293 36.3522 28.6294 35.3033 29.6783C34.2544 30.7272 32.918 31.4415 31.4632 31.7309C30.0083 32.0203 28.5003 31.8718 27.1299 31.3041C25.7594 30.7364 24.5881 29.7751 23.764 28.5418C22.9399 27.3084 22.5 25.8584 22.5 24.375C22.5 22.3859 23.2902 20.4782 24.6967 19.0717C26.1032 17.6652 28.0109 16.875 30 16.875Z" fill="${
      style?.color ? style.color : '#E6001C'
    }"/>
    <circle cx="30" cy="24" r="14 " fill="white"/>
    <text x="50%" y="42%" fill="#000" text-anchor="middle" font-size="4" dominant-baseline="middle" font-family="DIN,arial,sans-serif">${label}</text>
    </g>
    <defs>
    <clipPath id="clip0_7480_1802">
    <rect width="60" height="60" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    `;
    const parser = new DOMParser();
    const svgEl = parser.parseFromString(svg, 'image/svg+xml').documentElement;
    return svgEl;
  }
}

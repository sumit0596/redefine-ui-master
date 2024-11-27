import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialogComponent } from '../components/custom-dialog/custom-dialog.component';
import { ModalComponent } from '../components/modal/modal.component';
import {
  API_ROUTE,
  CONSTANTS,
  FEATURE_AMENITIES,
  FILETYPE,
} from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { saveAs } from 'file-saver-es';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private dialogRef: MatDialog,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private toasterService: ToastrService
  ) {}

  dialog(
    dialogData: any,
    button1Text: string,
    button2Text?: string,
    disableClose: boolean = false
  ): any {
    return this.dialogRef.open(CustomDialogComponent, {
      data: {
        text: dialogData,
        btn1Text: button1Text,
        btn2Text: button2Text,
      },
      disableClose: disableClose,
    });
  }
  showModal(
    title?: string | null,
    message?: string | null,
    description?: string | null,
    acceptBtnLabel?: string | null,
    rejectBtnLabel?: string | null,
    disableClose: boolean = false
  ) {
    return this.dialogRef.open(ModalComponent, {
      data: {
        message: message,
        title: title,
        description: description,
        acceptBtnLabel: acceptBtnLabel,
        rejectBtnLabel: rejectBtnLabel,
      },
      disableClose: disableClose,
    });
  }

  getFeatureIcons(name: string) {
    switch (name) {
      case FEATURE_AMENITIES.PIT:
        return 'barricade.svg';
      case FEATURE_AMENITIES.BALCONIES:
        return 'stairs.svg';
      case FEATURE_AMENITIES.CRANES:
      case FEATURE_AMENITIES.CRANE_MAKE:
      case FEATURE_AMENITIES.TONNAGE_ALLOCATION:
        return 'crane.svg';
      case FEATURE_AMENITIES.DEDICATED_TANKS:
      case FEATURE_AMENITIES.DIESEL_BOWSERS:
        return 'cylinder.svg';
      case FEATURE_AMENITIES.OUTSIDE_GANTRIES:
        return 'gantries.svg';
      case FEATURE_AMENITIES.GENERATOR:
      case FEATURE_AMENITIES.BACKUP_GENERATOR:
        return 'lightning.svg';
      case FEATURE_AMENITIES.SOLAR_PV:
        return 'sun.svg';
      case FEATURE_AMENITIES.SECURITY:
        return 'shield.svg';
      case FEATURE_AMENITIES.SPRINKLERS:
        return 'shower.svg';
      case FEATURE_AMENITIES.WEIGH_BRIDGE:
        return 'truck.svg';
      case FEATURE_AMENITIES.STOREROOMS:
        return 'warehouse.svg';
      case FEATURE_AMENITIES.STANDBY_WATER:
        return 'water-drop.svg';
      case FEATURE_AMENITIES.FIBRE:
        return 'fibre.svg';
      case FEATURE_AMENITIES.WIFI:
        return 'wifi.svg';
      case FEATURE_AMENITIES.ROOF:
        return 'roof.svg';
      default:
        return '';
    }
  }

  isNumberArray(data: any): boolean {
    let isStringArray: boolean = false;
    if (Array.isArray(data) && data.length > 0) {
      isStringArray = data.every((value) => {
        return typeof value === 'number';
      });
    }
    return isStringArray;
  }

  numberWithCommas(gla: any) {
    var gla = gla.toString().split('.');
    gla[0] = gla[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return gla[0];
  }

  keyUpValue(Num: any) {
    //function to add commas to textboxes
    Num += '';
    Num = Num.replace(',', '');
    Num = Num.replace(',', '');
    Num = Num.replace(',', '');
    Num = Num.replace(',', '');
    Num = Num.replace(',', '');
    Num = Num.replace(',', '');
    var x = Num.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) x1 = x1.replace(rgx, '$1' + ',' + '$2');
    return x1 + x2;
  }

  changeDataFormat(data: any, format: string) {
    let updatedData: any;
    switch (format.toUpperCase()) {
      case CONSTANTS.ARRAY:
        updatedData = data ? data.split(',') : [];
        return updatedData;

      case CONSTANTS.STRING:
        if (this.isNumberArray(data)) {
          return data;
        } else {
          updatedData = data?.map((d: any) => d.Id);
        }
        return updatedData;
    }
  }

  getHovercolor(index: any, id: any) {
    let ele = document.getElementById(id + index) as HTMLElement;
    ele.style.color = '#fa0a0a';
    ele.style.marginLeft = '20px';
    ele.style.transition = '0.5s';
    ele.style.cursor = 'pointer';
  }

  getLeavecolor(index: any, id: any) {
    let ele = document.getElementById(id + index) as HTMLElement;
    ele.style.color = '#000000';
    ele.style.marginLeft = '0px';
  }

  getQuickLinks(page: any) {
    let url: string = `${environment.apiBaseUrl}/frontend/menu/quicklinks/${page}`;
    return this.httpClient
      .get(url, {
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(map((res: any) => res.data));
  }

  getFullMonth(month: any): any {
    switch (month) {
      case 1:
        return 'January';
      case 2:
        return 'February';
      case 3:
        return 'March';
      case 4:
        return 'April';
      case 5:
        return 'May';
      case 6:
        return 'June';
      case 7:
        return 'July';
      case 8:
        return 'August';
      case 9:
        return 'September';
      case 10:
        return 'October';
      case 11:
        return 'November';
      case 12:
        return 'December';
    }
  }

  pdfDownload(url: any) {
    const URL = url;
    this.httpClient.get(URL, { responseType: 'arraybuffer' }).subscribe(
      (pdf) => {
        const file = url.split('/');
        const fileName = file[file.length - 1];
        let extension = fileName.split('.')[1];
        if (extension == 'pdf') {
          const blob = new Blob([pdf], { type: FILETYPE.PDF });
          saveAs(blob, fileName);
        } else if (extension == 'xlsx' || extension == 'xls') {
          const blob = new Blob([pdf], { type: FILETYPE.MS_EXCEL });
          saveAs(blob, fileName);
        }
      },
      (err) => {}
    );
  }

  addUpdateCustomSlider(payload: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.SLIDER_ADD}`;
    return this.httpClient.post(url, payload);
  }
  getCustomSlider(id: string) {
    return this.httpClient
      .get(`${environment.apiBaseUrl}${API_ROUTE.GET_SLIDER}/${id}`)
      .pipe(map((res: any) => res.data));
  }
  deleteCustomSlider(id: string, slideId?: number) {
    return this.httpClient.delete(
      `${environment.apiBaseUrl}${API_ROUTE.DELETE_SLIDER}/${id}`,
      {
        params: slideId
          ? new HttpParams({ fromObject: { CustomSliderId: slideId } })
          : undefined,
      }
    );
  }

  viewPdf(name: any) {
    if (name != '' && name != undefined) {
      let url = name.split('/').pop();
      window.open('/view-file/' + url, '_blank');
    }
  }

  setCompaign(
    compaign: any,
    utm_medium: any,
    utm_source: any,
    utm_content: any,
    utm_term: any,
    clickid: any
  ) {
    this.cookieService.set('utm_campaign', compaign, 30);
    this.cookieService.set('utm_medium', utm_medium ? utm_medium : '', 30);
    this.cookieService.set('utm_source', utm_source ? utm_source : '', 30);
    this.cookieService.set('utm_content', utm_content ? utm_content : '', 30);
    this.cookieService.set('utm_term', utm_term ? utm_term : '', 30);
    this.cookieService.set('utm_clickid', clickid ? clickid : '', 30);
  }

  getCompaign(key: any = 'utm_campaign'): any {
    return this.cookieService.get(key);
  }

  getBrowserId(): any {
    return this.cookieService.get('ajs_anonymous_id');
  }

  deleteFileConfirmation(): any {
    return this.showModal('Delete', CONSTANTS.FILE_DELETE_CONFIRMATION);
  }

  deleteImageConfirmation(): any {
    return this.showModal('Delete', CONSTANTS.IMAGE_DELETE_CONFIRMATION);
  }
}

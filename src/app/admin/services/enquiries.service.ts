import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';
import { API_ROUTE, SESSION } from 'src/app/models/constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class EnquiriesService {
  constructor(private http: HttpClient, private commonService: CommonService) { }

  enquiryTypeSubject = new BehaviorSubject<any[]>([]);
  enquiryType$ = this.enquiryTypeSubject.asObservable();

  getAllEnquiries(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_ENQUIRIES}`;
    let params = new HttpParams();
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });
    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }

  getEnquiryDetails(id: number): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_ENQUIRY_DETAILS}/${id}`;
    return this.http.get(url);
  }

  updateEnquiryStatus(payload: any, id: number) {
    let url = `${environment.apiBaseUrl + API_ROUTE.UPDATE_ENQUIRY_STATUS
      }/${id}`;
    let formData = new FormData();
    Object.keys(payload).forEach((key: any) => {
      formData.append(key, payload[key]);
    });
    return this.http.post(url, payload);
  }

  getEnquiryType(): Observable<any> {
    if (this.checkSession(SESSION.ENQUIRY_TYPE)) {
      this.enquiryTypeSubject.next(
        JSON.parse(sessionStorage.getItem(SESSION.ENQUIRY_TYPE) || '[]')
      );
    } else {
      this.loadEnquiryType();
    }
    return this.enquiryType$;
  }

  loadEnquiryType() {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_ENQUIRY_TYPE}`;
    const loadCity$ = this.http.get(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.ENQUIRY_TYPE, JSON.stringify(data));
        this.enquiryTypeSubject.next(data);
      })
    );
    loadCity$.subscribe();
  }

  uploadUserInfo(payload: any) {
    let url = `${environment.apiBaseUrl}/lead/add`;
    let formData = new FormData();
    if (this.commonService.getBrowserId()) {
      formData.append('BrowserId', this.commonService.getBrowserId());
    }
    if (this.commonService.getCompaign('utm_campaign')) {
      formData.append(
        'Campaign',
        this.commonService.getCompaign('utm_campaign')
      );
    }
    if (this.commonService.getCompaign('utm_medium')) {
      formData.append('Medium', this.commonService.getCompaign('utm_medium'));
    }
    if (this.commonService.getCompaign('utm_source')) {
      formData.append('Source', this.commonService.getCompaign('utm_source'));
    }
    if (this.commonService.getCompaign('utm_clickid')) {
      formData.append('ClickId', this.commonService.getCompaign('utm_clickid'));
    }
    if (this.commonService.getCompaign('utm_term')) {
      formData.append('Keyword', this.commonService.getCompaign('utm_term'));
    }
    if (this.commonService.getCompaign('DeviceType')) {
      formData.append('DeviceType', this.commonService.getCompaign('DeviceType'));
    }
    if (this.commonService.getCompaign('Os')) {
      formData.append('Os', this.commonService.getCompaign('Os'));
    }
    if (this.commonService.getCompaign('ScreenResolution')) {
      formData.append('ScreenResolution', this.commonService.getCompaign('ScreenResolution'));
    }
    if (this.commonService.getCompaign('ReferrerUrl')) {
      formData.append('ReferrerUrl', this.commonService.getCompaign('ReferrerUrl'));
    }
    if (this.commonService.getCompaign('utm_content')) {
      formData.append(
        'AdContent',
        this.commonService.getCompaign('utm_content')
      );
    }
    formData.append('Url',window.location.href);
    for (const key in payload) {
      if (payload[key] != null && payload[key] instanceof File) {
        formData.append(key, payload[key], payload[key].name);
      } else if (
        (typeof payload[key] == 'string' || typeof payload[key] == 'number') &&
        payload[key] != null
      ) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.post(url, formData);
  }

  private checkSession(key: string) {
    return sessionStorage.getItem(key) != undefined;
  }
}

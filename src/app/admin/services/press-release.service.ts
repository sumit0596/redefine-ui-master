import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ROUTE, CONSTANTS } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class PressReleaseService {
  constructor(private http: HttpClient) {}

  getAllPressRelease(payload: any, type: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PRESS_RELEASE}`;
    let params = new HttpParams();
    params = params.append('Type', type);
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });

    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }

  getPressReleaseDetails(id: number): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_PRESS_RELEASE_DETAILS
    }/${id}`;
    return this.http.get(url);
  }

  updateStatus(id: number, status: any) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_PRESS_RELEASE_STATUS
    }/${id}`;
    let formData = new FormData();
    formData.append(CONSTANTS.STATUS, status);
    return this.http.post(url, formData);
  }

  addPressRelease(payload: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.ADD_PRESS_RELEASE}`;
    let formData = new FormData();
    Object.keys(payload).forEach((key: any) => {
      formData.append(key, payload[key]);
    });
    return this.http.post(url, payload);
  }
  updatePressRelease(payload: any, id: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_PRESS_RELEASE
    }/${id}`;
    let formData = new FormData();
    Object.keys(payload).forEach((key: any) => {
      formData.append(key, payload[key]);
    });
    return this.http.post(url, payload);
  }

  getPressReleaseYears() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PRESS_RELEASE_YEARS}`;
    return this.http.get(url);
  }

  getAllFrontendPress(filter: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_FRONTEND_PRESS
    }`;
    let queryParams = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] !== undefined && filter[key] != null) {
        queryParams = queryParams.append(key, filter[key]);
      }
    });
    return this.http
      .get(url, { params: queryParams })
      .pipe(map((res: any) => res.data));
  }

  getRecentPress(slug: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/frontend/pressrelease/recently`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Slug', slug);
    return this.http.get(url, { params: queryParams });
  }

  FrontendPressDetails(id: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_FRONTEND_PRESS_DETAILS
    }/${id}`;
    return this.http.get(url);
  }

  getQuickLinks() {
    let url: string = `${environment.apiBaseUrl}/frontend/menu/quicklinks/press-office`;
    return this.http.get(url);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ROUTE } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class SensService {
  constructor(private http: HttpClient) {}

  fetchAllSens(filter: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_SENS}`;
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

  updateStatus(id: number, status: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.UPDATE_SENS_STATUS}/${id}`;
    let formData = new FormData();
    formData.append('Status', status);
    return this.http.post(url, formData);
  }

  updateDrip(id: number, drip: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.UPDATE_SENS_DRIP}/${id}`;
    let formData = new FormData();
    formData.append('Drip', drip);
    return this.http.post(url, formData);
  }

  viewSens(id: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_SENS_DETAILS
    }/${id}`;
    return this.http.get(url);
  }

  updateSens(payload: any, id: number) {
    let url = `${environment.apiBaseUrl + API_ROUTE.UPDATE_SENS}/${id}`;
    let formData = new FormData();
    Object.keys(payload).forEach((key: any) => {
      formData.append(key, payload[key]);
    });
    return this.http.post(url, payload);
  }

  getAllFrontendSens(filter: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_FRONTEND_SENS}`;
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

  getQuickLinks() {
    let url: string = `${environment.apiBaseUrl}/frontend/menu/quicklinks/sens-announcements`;
    return this.http.get(url);
  }

  getRecentSens(slug :any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/frontend/sens/recently`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Slug', slug);
    return this.http.get(url,{ params: queryParams });
  }

  FrontendSensDetails(id: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_FRONTEND_SENS_DETAILS
    }/${id}`;
    return this.http.get(url);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ROUTE } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class CircularService {
  constructor(private http: HttpClient) {}

  createCircular(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/circulars/add`;
    let formData = new FormData();
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

  updateCircular(payload: any, id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/circulars/update/${id}`;
    let formData = new FormData();
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

  getAllCirculars(payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/circulars/listing`;
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

  deleteCircular(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/circulars/delete/${id}`;
    return this.http.delete(url);
  }

  updateStatus(id: number, status: any) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_CIRCULAR_STATUS
    }/${id}`;
    let formData = new FormData();
    formData.append('Status', status);
    return this.http.post(url, formData);
  }

  updateDrip(id: number, drip: any) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_CIRCULAR_DRIP
    }/${id}`;
    let formData = new FormData();
    formData.append('Drip', drip);
    return this.http.post(url, formData);
  }

  viewCircular(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/circulars/details/${id}`;
    return this.http.get(url);
  }

  getAllFrontendCirculars(filter: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_FRONTEND_CIRCULARS
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

  deleteFile(id: number) {
    let url: string = `${environment.apiBaseUrl}/circulars/deletefile/${id}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Column', 'Pdf');
    return this.http.delete(url, { params: queryParams });
  }

  getFilterYears() {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_CIRCULARS_YEARS
    }`;
    return this.http.get(url);
  }
}

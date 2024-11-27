import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ROUTE } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class EsgService {
  constructor(private http: HttpClient) {}

  getAllEsg(payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_ESG}`;

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

  viewEsg(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/esgcontacts/details/${id}`;
    return this.http.get(url);
  }

  deleteEsg(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/esgcontacts/delete/${id}`;
    return this.http.delete(url);
  }

  createEsg(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/esgcontacts/add`;
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

  updateEsg(payload: any, id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/esgcontacts/update/${id}`;
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

  updateStatus(id: number, status: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.UPDATE_ESG_STATUS}/${id}`;
    let formData = new FormData();
    formData.append('Status', status);
    return this.http.post(url, formData);
  }

  deleteFile(id: number) {
    let url: string = `${environment.apiBaseUrl}/esgcontacts/deletefile/${id}`;
    return this.http.delete(url);
  }
}

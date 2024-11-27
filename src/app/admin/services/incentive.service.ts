import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class IncentiveService {
  constructor(private httpClient: HttpClient) {}

  createIncentive(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/incentives/add`;
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
    return this.httpClient.post(url, formData);
  }
  updateIncentive(payload: any, id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/incentives/update/${id}`;
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
    return this.httpClient.post(url, formData);
  }

  getIncentive(id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/incentives/details/${id}`;
    return this.httpClient.get(url).pipe(map((res: any) => res.data));
  }

  deleteIncentive(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/incentives/delete/${id}`;
    return this.httpClient.delete(url);
  }

  deleteFile(id: number, type: number) {
    let url: string = `${environment.apiBaseUrl}/incentives/deletefile/${id}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Type', type);
    return this.httpClient.delete(url, { params: queryParams });
  }

  getAllIncentives(payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/incentives/listing`;
    let params = new HttpParams();
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });
    return this.httpClient
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }
}

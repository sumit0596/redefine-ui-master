import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  constructor(private httpClient: HttpClient) {}
  createAttribute(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/attributes/add`;
    let formData = new FormData();
    for (const key in payload) {
      if (typeof payload[key] == 'object') {
        formData.append(key, payload[key], payload[key].name);
      } else {
        formData.append(key, payload[key]);
      }
    }
    return this.httpClient.post(url, formData);
  }
  updateAttribute(payload: any, id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/attributes/update/${id}`;
    let formData = new FormData();
    for (const key in payload) {
      if (typeof payload[key] == 'object' && payload[key] != null) {
        formData.append(key, payload[key], payload[key].name);
      } else {
        formData.append(key, payload[key]);
      }
    }
    return this.httpClient.put(url, payload);
  }
  getAttribute(id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/attributes/details/${id}`;
    return this.httpClient.get(url).pipe(map((res: any) => res.data));
  }

  deleteAttribute(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/attributes/delete/${id}`;
    return this.httpClient.delete(url);
  }

  getAllAttributes(payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/attributes/listing`;
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

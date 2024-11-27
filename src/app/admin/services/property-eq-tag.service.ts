import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ROUTE, CONSTANTS } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class PropertyEqTagService {
  constructor(private httpClient: HttpClient) {}

  createPropertyEqTag(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/propertyeqtag/add`;
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

  updatePropertyEqTag(payload: any, id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/propertyeqtag/update/${id}`;
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

  getPropertyEqTag(id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/propertyeqtag/details/${id}`;
    return this.httpClient.get(url).pipe(map((res: any) => res.data));
  }

  deletePropertyEqTag(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/propertyeqtag/delete/${id}`;
    return this.httpClient.delete(url);
  }

  getAllPropertyEqTags(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_EQ_TAG}`;
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

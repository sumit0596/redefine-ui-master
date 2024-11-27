import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ROUTE, CONSTANTS } from 'src/app/models/constants';
import { MEDIA_TYPE } from 'src/app/models/enum';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  getAllMedia(payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/media/listing`;
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

  uploadMedia(payload: any): Observable<any> {
    // let url = `${environment.apiBaseUrl + API_ROUTE.MEDIA_UPLOAD}`;
    // let formData = new FormData();
    // formData.append(CONSTANTS.FILE, file, file.name);
    // formData.append('Type', JSON.stringify(MEDIA_TYPE.CUSTOM_PAGES));
    // formData.append('SameName', sameName ? '2' : '0');
    // return this.http.post(url, formData);

    let url = `${environment.apiBaseUrl + API_ROUTE.MEDIA_UPLOAD}`;
    let formData = new FormData();
    formData.append('Type', JSON.stringify(MEDIA_TYPE.CUSTOM_PAGES));
    formData.append('SameName', payload.SameName ? '2' : '0');

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

  // createPropertyEq(payload: any) {
  //   let url = `${environment.apiBaseUrl + API_ROUTE.CREATE_MEDIA_UPLOAD}`;
  //   let formData = new FormData();
  //   for (const key in payload) {
  //     if (payload[key] != null && payload[key] instanceof File) {
  //       formData.append(key, payload[key], payload[key].name);
  //     } else if (
  //       (typeof payload[key] == 'string' || typeof payload[key] == 'number') &&
  //       payload[key] != null
  //     ) {
  //       formData.append(key, payload[key]);
  //     }
  //   }
  //   return this.http.post(url, payload);
  // }

  deleteMedia(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/media/file/delete/${id}`;
    return this.http.delete(url);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class UnitPreviewService {
  constructor(private http: HttpClient) {}

  unitPreviewDetails(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/property/unit/detailswithproperty/${id}`;
    return this.http.get(url);
  }

  getAvailableUnitDetails(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/propertyunit/available/${id}`;
    return this.http.get(url);
  }

  propertyDetails(slug: any, comapain?:any): Observable<any> {
    let queryParams = new HttpParams();
    if (comapain != undefined) {
      queryParams = queryParams.append('Campaign', comapain);
    }
    let url: string = `${environment.apiBaseUrl}/frontend/property/details/${slug}`;
    return this.http.get(url,  { params: queryParams });
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { API_ROUTE } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  
  campaignIdSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  getAllSettings(filter: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_SETTINGS}`;
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

  getCampaignSettingsData(filter: any){
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_CAMPAIGN_SETTINGS}`;
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

  setCampaignID(id: any) {
    this.campaignIdSubject.next(id);
  }
  getCampaignID() {
    return this.campaignIdSubject.asObservable();
  }

  getSettingDetails(name: string): Observable<any> {
    let url = `${environment.apiBaseUrl}/setting/details`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Name', name);
    return this.http.get(url, { params: queryParams }).pipe(map((res: any) => res.data));
  }

  getCampaignSettingDetails(id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/campaigncontact/details/${id}`;
    return this.http.get(url).pipe(map((res: any) => res.data));
  }
  
  updateSetting(payload: any, id: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/setting/update`;
    return this.http.put(url, payload);
  }

  postCampaignContact(payload: any){
    let url: string = `${environment.apiBaseUrl}/campaigncontact/add`;
    return this.http.post(url, payload);
  }
  deleteCampaignContact(id:number){
    let url = `${environment.apiBaseUrl}/campaigncontact/delete/${id}`;
    return this.http.delete(url);
  }

  updateCampaignContact(payload: any, id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/campaigncontact/update/${id}`;
    return this.http.put(url, payload);
  }
}

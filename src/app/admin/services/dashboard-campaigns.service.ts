import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { API_ROUTE, CONSTANTS, SESSION } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

interface ApiResponse {
  data: {
    Session: any;
    Lead: any;
    ConversionRate: any;
    QualifiedLeads: any;
  };
}
@Injectable({
  providedIn: 'root',
})
export class DashboardCampaignsService {
  constructor(private httpClient: HttpClient) {}

  getCampaignDropdown(): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_CAMPAIGNDROPDOWN_LIST}`;
    return this.httpClient.get(url).pipe(map((res: any) => res.data));
  }
  getCampaignLeadsDropdown(): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_CAMPAIGNDROPDOWN_LIST}`;
    return this.httpClient.get(url);
  }
  getCampaignLeadSources(campaign:string) {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_SOURCE_LIST}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Campaign', campaign);
    return this.httpClient.get(url, { params: queryParams });
  }
  getPropListDropdown(campaign:string): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PROP_LIST_DROPDOWN}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Campaign', campaign);
    return this.httpClient.get(url, { params: queryParams });
  }

 
  getLeasing(campaign:string) {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_LEASING_LIST}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Campaign', campaign);
    return this.httpClient.get(url, { params: queryParams });
  }

  getCampaignLeadMedium(campaign:string) {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_MEDIUM_LIST}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Campaign', campaign);
    return this.httpClient.get(url, { params: queryParams });
  }

  getAnalyticsCampaign(payload: any): Observable<ApiResponse> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_ANALYTICS_CAMPAIGN
    }`;
    let params = new HttpParams();
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });
    return this.httpClient.get<ApiResponse>(url, { params: params });
  }

  getAnalyticsCampaignLeadByStatus(payload: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_ANALYTICS_CAMPAIGN_LEAD
    }`;
    let params = new HttpParams();
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });
    return this.httpClient.get(url, { params: params });
  }

  // getAllLeadBySource(payload: any): Observable<any> {
  //   let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_CONTENT_TYPE}`;
  //   let params = new HttpParams();
  //   Object.keys(payload).forEach((key: string) => {
  //     if (payload[key] != undefined) {
  //       params = params.append(key, payload[key]);
  //     }
  //   });
  //   return this.httpClient.get(url, { params: params });
  // }

  // getAllLeadByMedium(payload: any): Observable<any> {
  //   let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_CONTENT_TYPE}`;
  //   let params = new HttpParams();
  //   Object.keys(payload).forEach((key: string) => {
  //     if (payload[key] != undefined) {
  //       params = params.append(key, payload[key]);
  //     }
  //   });
  //   return this.httpClient.get(url, { params: params });
  // }

  getContentType(payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_CONTENT_TYPE}`;
    let params = new HttpParams();
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });
    return this.httpClient.get(url, { params: params });
  }

  getTop20(payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_TOP_20}`;
    let params = new HttpParams();
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });
    return this.httpClient.get(url, { params: params });
  }

  getCampaignLeads(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_CAMPAIGN_LEADS}`;
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

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, map } from 'rxjs';
import { API_ROUTE, CONSTANTS } from 'src/app/models/constants';
import { PROPERTY_TYPE } from 'src/app/models/enum';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class FrontendService {  
  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  getUpdatedInvestorContacts(): any {
    let params = new HttpParams();
     params = params.append('Name', 'INVESTOR_CONTACTS_IDS');
     return this.httpClient
     .get(environment.apiBaseUrl + API_ROUTE.GET_SELECTED_INVESTORS, {
       params: params,
       headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
     })
     .pipe(map((res: any) => res.data?.Value?.split(',').map((num: string) => Number(num)) || []));
  }

  getEnquiryTypes() {
    return this.httpClient
      .get(environment.apiBaseUrl + API_ROUTE.GET_ENQUIRY_TYPE, {
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(map((res: any) => res.data));
  }
  addEnquiry(enquiryDetails: any) {
    if (this.commonService.getCompaign()) {
      enquiryDetails['Campaign'] = this.commonService.getCompaign();
    }
    return this.httpClient.post(
      environment.apiBaseUrl + API_ROUTE.ENQUIRY_ADD,
      enquiryDetails
    );
  }
  getOffices() {
    return this.httpClient
      .get(environment.apiBaseUrl + API_ROUTE.GET_OFFICES, {
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(map((res: any) => res.data));
  }

  getJobs() {
    return this.httpClient
      .get(environment.apiBaseUrl + API_ROUTE.GET_JOBS, {
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(map((res: any) => res.data.jobs));
  }
  getTeamMembers() {
    let params = new HttpParams();
    params = params.append('PerPage', 'all');
    return this.httpClient
      .get(environment.apiBaseUrl + API_ROUTE.GET_TEAM_MEMBER, {
        params: params,
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(map((res: any) => res.data.people));
  }
  getSelectedInvestorContacts(ids:string) {
    
    let params = new HttpParams();
    params = params.append('Ids', ids);
    return this.httpClient
    .get(environment.apiBaseUrl + API_ROUTE.GET_FRONTEND_SELECTED_INVESTORS, {
      headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      params
    })
    .pipe(map((res: any) => res.data.people));
  }

  updateInvestorContacts(updatedIds: string): Observable<any> {
    const updateInvestors = {Name:"INVESTOR_CONTACTS_IDS", Value:updatedIds }
    let url = `${environment.apiBaseUrl}`+ `${API_ROUTE.UPDATE_FRONTEND_SELECTED_INVESTORS}`;
    return this.httpClient.put(url,updateInvestors).pipe(map((res: any) =>{
       res.data,
       console.log(res.data)
      }));
  }

  getSensAnnouncements() {
    let params = new HttpParams();
    params = params.append('PerPage', 'all');
    return this.httpClient
      .get(environment.apiBaseUrl + API_ROUTE.GET_SENS_ANNOUNCEMENTS, {
        params: params,
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(map((res: any) => res.data.sensannouncements));
  }
  getEventsAnnouncements() {
    let params = new HttpParams();
    params = params.append('PerPage', 'all');
    return this.httpClient
      .get(environment.apiBaseUrl + API_ROUTE.GET_EVENTS_ANNOUNCEMENTS, {
        params: params,
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(map((res: any) => res.data.events));
  }
  getNewsAnnouncements() {
    let params = new HttpParams();
    params = params.append('PerPage', 'all');
    return this.httpClient
      .get(environment.apiBaseUrl + API_ROUTE.GET_NEWS_ANNOUNCEMENTS, {
        params: params,
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(map((res: any) => res.data.pressrelease));
  }
  getHomeGraphData() {
    let params = new HttpParams();
    params = params.append('PerPage', 'all');
    return this.httpClient
      .get(environment.apiBaseUrl + API_ROUTE.HOME_GRAPH_DATA, {
        params: params,
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(map((res: any) => res.data.graphdata));
  }
  getHomeSlider(carouselId: string) {
    return this.httpClient
      .get(`${environment.apiBaseUrl}${API_ROUTE.HOME_SLIDER}/${carouselId}`, {
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(map((res: any) => res.data));
  }
  addSlider(enquiryDetails: any) {
    return this.httpClient.post(
      environment.apiBaseUrl + API_ROUTE.SLIDER_ADD,
      {}
    );
  }
  getFeaturedProperties(propertyType: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_FEATURED_PROPERTY}`;
    let params = new HttpParams();
    params = params.append(
      'Type',
      propertyType ? propertyType : PROPERTY_TYPE.SOUTH_AFRICA
    );
    return this.httpClient
      .get(url, {
        params: params,
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(map((res: any) => res.data));
  }

}

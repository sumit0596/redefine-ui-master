import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTE } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  constructor(private http: HttpClient) {}

  getAllPeople(
    pageSize: any,
    pageNumber: any,
    type: number,
    peopleStatusIds?: any,
    searchValue?: any,
    sortBy?: any,
    sortOrder?: any
  ): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/investorcontacts/listing`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('PageNo', pageNumber);
    queryParams = queryParams.append('PerPage', pageSize);
    queryParams = queryParams.append('Type', type);

    if (peopleStatusIds != undefined) {
      queryParams = queryParams.append('Status', peopleStatusIds);
    }
    if (searchValue != undefined) {
      queryParams = queryParams.append('Search', searchValue);
    }
    if (sortBy != undefined) {
      queryParams = queryParams.append('SortBy', sortBy);
    }
    if (sortOrder != undefined) {
      queryParams = queryParams.append('SortOrder', sortOrder);
    }
    return this.http.get(url, { params: queryParams });
  }

  viewPeople(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/investorcontacts/details/${id}`;
    return this.http.get(url);
  }

  deletePeople(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/investorcontacts/delete/${id}`;
    return this.http.delete(url);
  }

  createPeople(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/investorcontacts/add`;
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

  updatePeople(payload: any, id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/investorcontacts/update/${id}`;
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
    let url = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_PEOPLE_STATUS
    }/${id}`;
    let formData = new FormData();
    formData.append('Status', status);
    return this.http.post(url, formData);
  }

  deleteFile(id: number) {
    let url: string = `${environment.apiBaseUrl}/investorcontacts/deletefile/${id}`;
    return this.http.delete(url);
  }

  viewPeopleFrontEnd(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/frontend/investorcontacts/details/${id}`;
    return this.http.get(url);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';
import { API_ROUTE, SESSION } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  constructor(private http: HttpClient) {}
 
  
    loadSearchResults(
    s: any,
    pageSize?: any,
    pageNumber?: any,
    Type?: any
  ): Observable<any> {
    let url: string = `${environment.apiBaseUrl+API_ROUTE.FRONTEND_SEARCH}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Search', s);
    queryParams = queryParams.append('PageNo', pageNumber);
    queryParams = queryParams.append('PerPage', pageSize);
	if(Type != '' && Type != undefined){
    queryParams = queryParams.append('Type', Type);
	}
    return this.http.get(url, { params: queryParams });
  }

  
}

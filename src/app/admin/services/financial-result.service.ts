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
import { API_ROUTE, CONSTANTS, SESSION } from 'src/app/models/constants';
import { MEDIA_TYPE } from 'src/app/models/enum';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class FinancialResultService {
  resultTypeSubject = new BehaviorSubject<any>(undefined);
  resultType$ = this.resultTypeSubject.asObservable();
  pressReleaseSubject = new BehaviorSubject<any>(undefined);
  pressRelease$ = this.pressReleaseSubject.asObservable();

  webcastSubject = new BehaviorSubject<any>(undefined);
  webcast$ = this.webcastSubject.asObservable();
  constructor(private httpClient: HttpClient) {}
  private checkSession(key: string) {
    return sessionStorage.getItem(key) != undefined;
  }

  //Needs to be pushed in common data service.
  async getResultTypeDropdownData(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.RESULT_TYPES)) {
      this.resultTypeSubject.next(
        JSON.parse(sessionStorage.getItem(SESSION.RESULT_TYPES) || '[]')
      );
    } else {
      await this.loadResultTypes();
    }
    return this.resultType$;
  }

  deleteResult(id: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.DELETE_FINANCIAL
    }/${id}`;
    return this.httpClient.delete(url);
  }

  async loadResultTypes() {
    let data = [
      {
        Id: 1,
        Name: 'Annual',
      },
      {
        Id: 2,
        Name: 'Interim',
      },
    ];
    this.resultTypeSubject.next(data);
    this.resultType$.subscribe();
  }

  getPressReleaseDropdownData(): Observable<any> {
    this.loadPressRelease();
    return this.pressRelease$;
  }
  loadPressRelease() {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.FINANCIAL_PRESS_RELEASE_DROPDOWN
    }`;
    const loadPressRelease$ = this.httpClient.get(url).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        this.pressReleaseSubject.next(data);
      })
    );
    return loadPressRelease$.subscribe();
  }

  getWebCastDropdownData(): Observable<any> {
    this.loadWebCast();
    return this.webcast$;
  }
  loadWebCast() {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Type', 2);
    let url = `${
      environment.apiBaseUrl + API_ROUTE.FINANCIAL_WEBCAST_DROPDOWN
    }`;
    const loadWebCast$ = this.httpClient.get(url, { params: queryParams }).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        this.webcastSubject.next(data);
      })
    );
    return loadWebCast$.subscribe();
  }

  getResultById(id: number): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_FINANCIAL}/${id}`;
    return this.httpClient.get(url).pipe(map((res: any) => res.data));
  }

  deleteFile(id: number, type: string) {
    let url: string = `${environment.apiBaseUrl}/financialresults/deletefile/${id}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Column', type);
    return this.httpClient.delete(url, { params: queryParams });
  }

  getFinancialResultData(payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/financialresults/list`;
    let params = new HttpParams();
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });
    return this.httpClient.get(url, { params: params });
  }

  createResult(data: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/financialresults/add`;
    let formData = new FormData();
    for (const key in data) {
      if (typeof data[key] == 'object' && data[key]) {
        formData.append(key, data[key], data[key].name);
      } else if (
        (typeof data[key] == 'string' || typeof data[key] == 'number') &&
        data[key] != ''
      ) {
        formData.append(key, data[key]);
      }
    }
    return this.httpClient.post(url, formData);
  }

  updateResult(data: any, id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/financialresults/update/${id}`;
    let formData = new FormData();
    for (const key in data) {
      if (typeof data[key] == 'object' && data[key]) {
        formData.append(key, data[key], data[key].name);
      } else if (typeof data[key] == 'string' || typeof data[key] == 'number') {
        formData.append(key, data[key]);
      }
    }
    return this.httpClient.post(url, formData);
  }
  updateResultStatus(id: number, status: any): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_FINANCIAL_RESULT_STATUS
    }/${id}`;
    let formData = new FormData();
    formData.append('Status', status);
    return this.httpClient.post(url, formData);
  }
  getAllFinancialResultsFrontend(filter: any, slug: any) {
   let url: string ='';
	  if(slug != '' && slug != undefined){
    url = `${environment.apiBaseUrl}/frontend/financialresults/list/${slug}`;
	  } else {
    url = `${environment.apiBaseUrl}/frontend/financialresults/list`;
	  }

    let queryParams = new HttpParams();

    // queryParams = queryParams.append('Type', type);

    Object.keys(filter).forEach((key: string) => {
      if (filter[key] !== undefined && filter[key] != null) {
        queryParams = queryParams.append(key, filter[key]);
      }
    });

    return this.httpClient
      .get(url, { params: queryParams })

      .pipe(map((res: any) => res.data));
  }

  getQuickLinks() {
    let url: string = `${environment.apiBaseUrl}/frontend/menu/quicklinks/financial-results`;
    return this.httpClient.get(url);
  }

  uploadMedia(file: any, type: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.MEDIA_UPLOAD}`;
    let formData = new FormData();
    if(type == 'Results'){
      formData.append('SameName', '1');
    }
    formData.append(CONSTANTS.FILE, file, file.name);
    formData.append('Type', JSON.stringify(MEDIA_TYPE.FINANCIAL_RESULTS));
    //formData.append('Column', JSON.stringify(type));
    return this.httpClient.post(url, formData);
  }

  deleteMedia(id: number, type: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Column', type);
    let url = `${
      environment.apiBaseUrl + API_ROUTE.DELETE_INTEGRATED_REPORT_MEDIA
    }/${id}`;
    return this.httpClient.delete(url, { params: queryParams });
  }

  getFilterYears() {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_FINANCIAL_YEARS
    }`;
    return this.httpClient.get(url);
  }
}

export enum RESULT_TYPE {
  Annual = 1,
  Interim = 2,
}

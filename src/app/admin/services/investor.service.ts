import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { API_ROUTE, CONSTANTS } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class InvestorService {
  integratedDocumentColorSubject: BehaviorSubject<any> =
    new BehaviorSubject<any>(undefined);
  integratedDocumentColors$: Observable<any> =
    this.integratedDocumentColorSubject.asObservable();
  constructor(private http: HttpClient) {}
  getAllIntegratedReport(payload: any): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_INTEGRATED_REPORTS_LIST
    }`;
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
  getIntegratedReportColors(): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_INTEGRATED_REPORT_COLOR_LIST
    }`;
    return this.http.get(url).pipe(map((res: any) => res.data));
  }
  updateStatus(id: number, status: any) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_INTEGRATED_REPORT_STATUS
    }/${id}`;
    let formData = new FormData();
    formData.append(CONSTANTS.STATUS, status);
    return this.http.post(url, formData);
  }
  getIntegratedReportDetails(id: number): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_INTEGRATED_REPORT_DETAILS
    }/${id}`;
    return this.http.get(url);
  }
  addIntegratedReport(payload: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.ADD_INTEGRATED_REPORT}`;
    Object.keys(payload).forEach((key: any) => {
      if (!payload[key]) {
        delete payload[key];
      }
    });
    return this.http.post(url, payload);
  }
  updateIntegratedReport(payload: any, id: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_INTEGRATED_REPORT
    }/${id}`;
    Object.keys(payload).forEach((key: any) => {
      if (!payload[key]) {
        delete payload[key];
      }
    });
    return this.http.post(url, payload);
  }
  deleteIntegratedReport(id: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.DELETE_INTEGRATED_REPORT
    }/${id}`;
    return this.http.delete(url);
  }
  deleteIntegratedReportDocument(id: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.DELETE_INTEGRATED_REPORT_DOCUMENT
    }/${id}`;
    return this.http.delete(url);
  }
  uploadIntegratedReportMedia(file: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.MEDIA_UPLOAD}`;
    let formData = new FormData();
    formData.append(CONSTANTS.FILE, file, file.name);
    return this.http.post(url, formData);
  }
  deleteIntegratedReportMedia(id: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.DELETE_INTEGRATED_REPORT_MEDIA
    }/${id}`;
    return this.http.delete(url);
  }
  deleteIntegratedReportDocumentLink(id: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.DELETE_INTEGRATED_REPORT_DOCUMENT_LINK
    }/${id}`;
    return this.http.delete(url);
  }
  addUpdateIntegratedReport(payload: any) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.ADD_UPDATE_INTEGRATED_REPORT_DOCUMENT
    }`;
    return this.http.post(url, payload);
  }

  async loadIntegratedReportDocumentColors() {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_INTEGRATED_REPORT_COLOR_LIST
    }`;
    const loadDocumentColors$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        this.integratedDocumentColorSubject.next(data);
      })
    );
    return loadDocumentColors$.subscribe();
  }
  getIntegratedReportDocumentColors(): Observable<any> {
    if (this.integratedDocumentColorSubject.value) {
      return this.integratedDocumentColors$;
    } else {
      this.loadIntegratedReportDocumentColors();
    }
    return this.integratedDocumentColors$;
  }

  getIntegratedReportsFrontend(
    filter: any,
    type: number,
    slug: any
  ): Observable<any> {
    let url: string ='';
	  if(slug != '' && slug != undefined){
    url = `${environment.apiBaseUrl + API_ROUTE.GET_FRONTEND_INTEGRATED_REPORTS}/${slug}`;
	  } else {
    url = `${environment.apiBaseUrl + API_ROUTE.GET_FRONTEND_INTEGRATED_REPORTS}`;
	  }
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Type', type);
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] !== undefined && filter[key] != null) {
        queryParams = queryParams.append(key, filter[key]);
      }
    });
    return this.http
      .get(url, { params: queryParams })
      .pipe(map((res: any) => res.data));
  }

  getQuickLinks() {
    let url: string = `${environment.apiBaseUrl}/frontend/menu/quicklinks/integrated-reports`;
    return this.http.get(url);
  }

  getFilterYears() {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_INTEGRATED_REPORTS_YEARS
    }`;
    return this.http.get(url);
  }
}

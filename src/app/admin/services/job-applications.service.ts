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
export class JobApplicationsService {
  formConfig: any = undefined;

  formConfigSubject = new BehaviorSubject<any>(this.formConfig);
  formConfig$: Observable<any> = this.formConfigSubject.asObservable();
  statusSubject = new BehaviorSubject<any[]>([]);
  status$ = this.statusSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllJobApplications(filter: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_JOB_APPLICATION}`;
    let params = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] != undefined) {
        params = params.append(key, filter[key]);
      }
    });
    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }

  deleteApplicant(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/${API_ROUTE.DELETE_JOB_APPLICATION}/${id}`;
    return this.http.delete(url);
  }

  getApplicantDetails(id: number): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_APPLICANT_DETAILS
    }/${id}`;
    return this.http.get(url);
  }

  getApplicationHistory(filter: any, Id: any): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_APPLICATION_HISTORY
    }/${Id}`;
    let params = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] != undefined) {
        params = params.append(key, filter[key]);
      }
    });
    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }

  getApplicationDetails(id: number): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_APPLICATION_DETAILS
    }/${id}`;
    return this.http.get(url);
  }

  updateApplicationStatus(payload: any, id: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_APPLICATION_STATUS
    }/${id}`;
    let formData = new FormData();
    Object.keys(payload).forEach((key: any) => {
      formData.append(key, payload[key]);
    });
    return this.http.post(url, payload);
  }

  private checkSession(key: string) {
    return sessionStorage.getItem(key) != undefined;
  }

  async getApplicationStatus(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.APPLICATION_STATUS)) {
      this.statusSubject.next(
        JSON.parse(sessionStorage.getItem(SESSION.APPLICATION_STATUS) || '[]')
      );
    } else {
      await this.loadApplicationStatus();
    }
    return this.status$;
  }

  async loadApplicationStatus() {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_APPLICATION_STATUS
    }`;
    const loadStatus$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.APPLICATION_STATUS,
          JSON.stringify(data)
        );
        this.statusSubject.next(data);
      })
    );
    loadStatus$.subscribe();
  }

  async setFormConfig(formConfig: any) {
    sessionStorage.setItem(
      SESSION.APP_HISTORY_CONFIG,
      JSON.stringify(formConfig)
    );
    this.formConfigSubject.next(formConfig);
  }

  async getFormConfig(): Promise<Observable<any>> {
    if (this.formConfigSubject.value) {
      return this.formConfigSubject.value;
    } else {
      this.formConfig = JSON.parse(
        sessionStorage.getItem(SESSION.FORM_CONFIG) ||
          '{"id":"undefined","mode":"undefined"}'
      );
      this.formConfigSubject.next(this.formConfig);
    }
    return this.formConfigSubject.value;
  }
}

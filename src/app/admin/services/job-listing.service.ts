import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
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
export class JobListingService {
  constructor(private http: HttpClient) {}

  jobTypesSubject = new BehaviorSubject<any[]>([]);
  jobTypes$ = this.jobTypesSubject.asObservable();

  jobAddressSubject = new BehaviorSubject<any[]>([]);
  jobAddress$ = this.jobAddressSubject.asObservable();

  RegionAddressSubject = new BehaviorSubject<any[]>([]);
  jobRegionAddress$ = this.RegionAddressSubject.asObservable();

  jobLevelSubject = new BehaviorSubject<any[]>([]);
  jobLevel$ = this.jobLevelSubject.asObservable();

  applicantIdSubject = new BehaviorSubject<any>(null);

  getAllJobListings(payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_JOB_LISTINGS}`;

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

  getJobListingsDetails(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/jobs/details/${id}`;
    return this.http.get(url);
  }

  addJobListings(payload: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.ADD_JOB_LISTINGS}`;
    let formData = new FormData();
    Object.keys(payload).forEach((key: any) => {
      formData.append(key, payload[key]);
    });
    return this.http.post(url, payload);
  }

  updateJobListings(payload: any, id: number) {
    let url = `${environment.apiBaseUrl + API_ROUTE.UPDATE_JOB_LISTINGS}/${id}`;
    let formData = new FormData();
    Object.keys(payload).forEach((key: any) => {
      formData.append(key, payload[key]);
    });
    return this.http.put(url, payload);
  }

  deleteJobListing(id: number) {
    let url = `${environment.apiBaseUrl + API_ROUTE.DELETE_JOB_LISTING}/${id}`;
    return this.http.delete(url);
  }

  updateStatus(id: number, status: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.UPDATE_JOBS_STATUS}/${id}`;
    let formData = new FormData();
    formData.append('Status', status);
    return this.http.post(url, formData);
  }

  async getJobLevel(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.JOB_LIST_LEVEL)) {
      this.jobLevelSubject.next(
        JSON.parse(sessionStorage.getItem(SESSION.JOB_LIST_LEVEL) || '[]')
      );
    } else {
      await this.loadJobLevel();
    }

    return this.jobLevel$;
  }

  async loadJobLevel() {
    let url: string = `${environment.apiBaseUrl}/jobs/joblevel/list`;

    const loadJobLevel$ = this.http.get(url).pipe(
      map((res: any) => res.data),

      catchError((error: any) => {
        return throwError(() => new error(error));
      }),

      tap((data: any) => {
        sessionStorage.setItem(SESSION.JOB_LIST_LEVEL, JSON.stringify(data));

        this.jobLevelSubject.next(data);
      })
    );

    loadJobLevel$.subscribe();
  }

  async getRegionAddress(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.REGION_ADDRESS)) {
      this.RegionAddressSubject.next(
        JSON.parse(sessionStorage.getItem(SESSION.REGION_ADDRESS) || '[]')
      );
    } else {
      await this.loadRegionAddress();
    }

    return this.jobRegionAddress$;
  }

  async loadRegionAddress() {
    let url: string = `${environment.apiBaseUrl}/regionaloffices/list`;

    const loadJobRegionAddress$ = this.http.get(url).pipe(
      map((res: any) => res.data),

      catchError((error: any) => {
        return throwError(() => new error(error));
      }),

      tap((data: any) => {
        sessionStorage.setItem(SESSION.REGION_ADDRESS, JSON.stringify(data));

        this.RegionAddressSubject.next(data);
      })
    );

    loadJobRegionAddress$.subscribe();
  }

  async getAddress(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.JOB_LIST_ADDRESS)) {
      this.jobAddressSubject.next(
        JSON.parse(sessionStorage.getItem(SESSION.JOB_LIST_ADDRESS) || '[]')
      );
    } else {
      await this.loadAddressTypes();
    }

    return this.jobAddress$;
  }

  async loadAddressTypes() {
    let url: string = `${environment.apiBaseUrl}/jobs/jobaddress/list`;

    const loadAddress$ = this.http.get(url).pipe(
      map((res: any) => res.data),

      catchError((error: any) => {
        return throwError(() => new error(error));
      }),

      tap((data: any) => {
        sessionStorage.setItem(SESSION.JOB_LIST_ADDRESS, JSON.stringify(data));

        this.jobAddressSubject.next(data);
      })
    );

    loadAddress$.subscribe();
  }

  async getJobTypes(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.JOB_LIST_TYPES)) {
      this.jobTypesSubject.next(
        JSON.parse(sessionStorage.getItem(SESSION.JOB_LIST_TYPES) || '[]')
      );
    } else {
      await this.loadJobTypes();
    }

    return this.jobTypes$;
  }

  private checkSession(key: string) {
    return sessionStorage.getItem(key) != undefined;
  }

  async loadJobTypes() {
    let url: string = `${environment.apiBaseUrl}/jobs/jobtype/list`;

    const loadJobTypes$ = this.http.get(url).pipe(
      map((res: any) => res.data),

      catchError((error: any) => {
        return throwError(() => new error(error));
      }),

      tap((data: any) => {
        sessionStorage.setItem(SESSION.JOB_LIST_TYPES, JSON.stringify(data));

        this.jobTypesSubject.next(data);
      })
    );

    loadJobTypes$.subscribe();
  }

  getApplicantApplied(filter: any, Id: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/jobs/applied/listing/${Id}`;
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

  setApplicantID(id: any) {
    this.applicantIdSubject.next(id);
  }
  getApplicationID() {
    return this.applicantIdSubject.asObservable();
  }
}

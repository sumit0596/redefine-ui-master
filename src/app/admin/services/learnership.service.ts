import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  async,
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
export class LearnershipService {
  CategoryTypesSubject = new BehaviorSubject<any[]>([]);

  CategoryTypes$ = this.CategoryTypesSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateStatus(ApplicantStatusId: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.UPDATE_LEARNERSHIP_STATUS}`;
    return this.http.post(url, ApplicantStatusId);
  }

  getAllLearnershipApplications(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_LEARNERSHIPS_LIST}`;
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

  async loadPrsentationCategoryTypes() {
    let url: string = `${environment.apiBaseUrl}/applicant/status/list`;

    const loadCategories$ = this.http.get(url).pipe(
      map((res: any) => res.data),

      catchError((error: any) => {
        return throwError(() => new error(error));
      }),

      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.LEARNERSHIP_STATUS_TYPES,
          JSON.stringify(data)
        );

        this.CategoryTypesSubject.next(data);
      })
    );

    loadCategories$.subscribe();
  }

  private checkSession(key: string) {
    return sessionStorage.getItem(key) != undefined;
  }

  async getStatus(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.LEARNERSHIP_STATUS_TYPES)) {
      this.CategoryTypesSubject.next(
        JSON.parse(
          sessionStorage.getItem(SESSION.LEARNERSHIP_STATUS_TYPES) || '[]'
        )
      );
    } else {
      await this.loadPrsentationCategoryTypes();
    }

    return this.CategoryTypes$;
  }

  getLearnershipDetails(id: number): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_LEARNERSHIP_DETAILS
    }/${id}`;
    return this.http.get(url);
  }

  deleteLearnership(id: number) {
    let url = `${environment.apiBaseUrl + API_ROUTE.DELETE_LEARNERSHIP}/${id}`;
    return this.http.delete(url);
  }

  getApplicantStatus() {
    let url = `${environment.apiBaseUrl}/applicant/status/list`;
    return this.http.get(url);
  }
}

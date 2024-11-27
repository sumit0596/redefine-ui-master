import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { API_ROUTE, SESSION } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class DebtProgrammeService {
  debtCreditTypesSubject = new BehaviorSubject<any[]>([]);
  debtCreditTypes$ = this.debtCreditTypesSubject.asObservable();
  debtCreditCategoryTypesSubject = new BehaviorSubject<any[]>([]);
  debtCreditCategoryTypes$ = this.debtCreditCategoryTypesSubject.asObservable();

  constructor(private http: HttpClient) {}

  private checkSession(key: string) {
    return sessionStorage.getItem(key) != undefined;
  }

  createDebtProgramme(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/debtcreditratings/add`;
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

  updateDebtProgramme(payload: any, id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/debtcreditratings/update/${id}`;
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

  getAllDebtProgrammes(
    pageSize: any,
    pageNumber: any,
    type: any,
    debtStatusIds?: any,
    categoryIds?: any,
    searchValue?: any,
    sortBy?: any,
    sortOrder?: any
  ): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/debtcreditratings/listing`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('PageNo', pageNumber);
    queryParams = queryParams.append('PerPage', pageSize);
    if (type != undefined) {
      queryParams = queryParams.append('Type', type);
    }
    if (debtStatusIds != undefined) {
      queryParams = queryParams.append('Status', debtStatusIds);
    }
    if (categoryIds != undefined) {
      queryParams = queryParams.append('CategoryId', categoryIds);
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

  deleteDebtProgramme(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/debtcreditratings/delete/${id}`;
    return this.http.delete(url);
  }

  viewDebtProgramme(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/debtcreditratings/details/${id}`;
    return this.http.get(url);
  }

  updateStatus(id: number, status: any) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_DEBT_PROGRAMME_STATUS
    }/${id}`;
    let formData = new FormData();
    formData.append('Status', status);
    return this.http.post(url, formData);
  }

  async getDebtCreditTypes(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.DEBT_CREDIT_TYPES)) {
      this.debtCreditTypesSubject.next(
        JSON.parse(sessionStorage.getItem(SESSION.DEBT_CREDIT_TYPES) || '[]')
      );
    } else {
      await this.loadDebtCreditTypes();
    }
    return this.debtCreditTypes$;
  }

  async loadDebtCreditTypes() {
    let url: string = `${environment.apiBaseUrl}/debtcreditratings/debtcredittype/list`;
    const loadTypes$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.DEBT_CREDIT_TYPES, JSON.stringify(data));
        this.debtCreditTypesSubject.next(data);
      })
    );
    loadTypes$.subscribe();
  }

  async getDebtCreditCategoryTypes(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.DEBT_CREDIT_CATEGORY_TYPES)) {
      this.debtCreditCategoryTypesSubject.next(
        JSON.parse(
          sessionStorage.getItem(SESSION.DEBT_CREDIT_CATEGORY_TYPES) || '[]'
        )
      );
    } else {
      await this.loadDebtCreditCategoryTypes();
    }
    return this.debtCreditCategoryTypes$;
  }

  async loadDebtCreditCategoryTypes() {
    let url: string = `${environment.apiBaseUrl}/debtcreditratings/debtcreditcategory/list`;
    const loadCategories$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.DEBT_CREDIT_CATEGORY_TYPES,
          JSON.stringify(data)
        );
        this.debtCreditCategoryTypesSubject.next(data);
      })
    );
    loadCategories$.subscribe();
  }

  deleteFile(id: number) {
    let url: string = `${environment.apiBaseUrl}/debtcreditratings/deletefile/${id}`;
    return this.http.delete(url);
  }

  getAllDebtProgrammesFrontend(type: any) {
    let url: string = `${environment.apiBaseUrl}/frontend/debtcreditratings/list`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Type', type);
    queryParams = queryParams.append('PerPage', 'all');
    return this.http.get(url, { params: queryParams });
  }

  getQuickLinks() {
    let url: string = `${environment.apiBaseUrl}/frontend/menu/quicklinks/debt-programme`;
    return this.http.get(url);
  }
}

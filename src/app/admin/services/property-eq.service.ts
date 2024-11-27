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
export class PropertyEqService {
  getArticles(filter: {
    SortBy: string | undefined;
    SortOrder: string;
    StartDate: string;
    EndDate: string;
    CategoryId: number | undefined;
    TypeId: number;
    PageNo: number;
    PerPage: number;
    Search: string;
  }) {
    throw new Error('Method not implemented.');
  }
  CategoryTypesSubject = new BehaviorSubject<any[]>([]);
  CategoryTypes$ = this.CategoryTypesSubject.asObservable();

  CategoryTypeSubject = new BehaviorSubject<any[]>([]);
  CategoryType$ = this.CategoryTypeSubject.asObservable();

  CategoryTagSubject = new BehaviorSubject<any[]>([]);
  CategoryTag$ = this.CategoryTagSubject.asObservable();

  enquiryMediaTypeSubject = new BehaviorSubject<any[]>([]);
  propertyMediaEnquiryType$ = this.enquiryMediaTypeSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllPropertyEq(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_EQ}`;
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

  createPropertyEq(payload: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.CREATE_PROPERTY_EQ}`;
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
    return this.http.post(url, payload);
  }

  updatePropertyEq(payload: any, id: number, type: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.UPDATE_PROPERTY_EQ}/${id}`;
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
    return this.http.put(url, payload);
  }

  getPropertyEq(id: any): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_EQ_DETAILS
    }/${id}`;
    return this.http.get(url);
  }

  updateStatus(id: number, status: any) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_PROPERTY_EQ_STATUS
    }/${id}`;
    let formData = new FormData();
    formData.append(CONSTANTS.STATUS, status);
    return this.http.post(url, formData);
  }

  async getMediaTypeCategories(): Promise<Observable<any>> {
    await this.loadPrsentationCategoryTypes();
    return this.CategoryTypes$;
  }

  uploadPropertyEqImage(file: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.MEDIA_UPLOAD}`;
    let formData = new FormData();
    formData.append(CONSTANTS.FILE, file, file.name);
    formData.append('Type', JSON.stringify(MEDIA_TYPE.PropertyEQ));
    return this.http.post(url, formData);
  }

  deletePropertyEqImage(id: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.DELETE_INTEGRATED_REPORT_MEDIA
    }/${id}`;
    return this.http.delete(url);
  }

  async loadPrsentationCategoryTypes() {
    let url: string = `${environment.apiBaseUrl}/propertyeq/type/list`;

    const loadCategories$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.PROPERTY_EQ_CATEGORY_TYPES,
          JSON.stringify(data)
        );
        this.CategoryTypesSubject.next(data);
      })
    );
    loadCategories$.subscribe();
  }

  async getCategories(): Promise<Observable<any>> {
    await this.loadPropertyEqCategoryTypes();
    return this.CategoryType$;
  }

  async loadPropertyEqCategoryTypes() {
    let url: string = `${environment.apiBaseUrl}/propertyeq/category/list`;

    const loadPropertyCategories$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        this.CategoryTypeSubject.next(data);
      })
    );
    loadPropertyCategories$.subscribe();
  }

  async getTagCategories(): Promise<Observable<any>> {
    await this.loadPropertyTagCategoryTypes();
    return this.CategoryTag$;
  }

  async loadPropertyTagCategoryTypes() {
    let url: string = `${environment.apiBaseUrl}/propertyeqtag/list`;

    const loadPropertyTagCategories$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        this.CategoryTagSubject.next(data);
      })
    );
    loadPropertyTagCategories$.subscribe();
  }

  // Sumit changes

  getPropertyEnquiryType(): Observable<any> {
    this.loadPropertyEqType();
    return this.propertyMediaEnquiryType$;
  }

  loadPropertyEqType() {
    let url: string = `${environment.apiBaseUrl}/propertyeq/type/list`;
    const loadType$ = this.http.get(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        this.enquiryMediaTypeSubject.next(data);
      })
    );
    loadType$.subscribe();
  }

  getPropertyEqSeodata(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/propertyeq/details/seo/${id}`;
    return this.http.get(url);
  }

  updatePropertyEqSeo(id: any, payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/propertyeq/update/seo/${id}`;
    return this.http.put(url, payload);
  }

  deletePropertyEq(id: number) {
    let url = `${environment.apiBaseUrl + API_ROUTE.DELETE_PROPERTY_EQ}/${id}`;
    return this.http.delete(url);
  }
}

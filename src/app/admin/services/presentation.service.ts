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
export class PresentationService {
  CategoryTypesSubject = new BehaviorSubject<any[]>([]);

  CategoryTypes$ = this.CategoryTypesSubject.asObservable();

  constructor(private http: HttpClient) {}

  createPresentation(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/presentations/add`;
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

  // updatePresentation(payload: any, id: number): Observable<any> {
  //   let url = `${environment.apiBaseUrl}/presentations/update/${id}`;
  //   return this.http.put(url, payload);
  // }

  updatePresentation(payload: any, id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/presentations/update/${id}`;
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

  getAllPresentations(
    pageSize: any,
    pageNumber: any,
    type?: number,
    presentationStatusIds?: any,
    searchValue?: any,
    sortBy?: any,
    sortOrder?: any
  ): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/presentations/list`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('PageNo', pageNumber);
    queryParams = queryParams.append('PerPage', pageSize);

    if (presentationStatusIds != undefined) {
      queryParams = queryParams.append('Status', presentationStatusIds);
    }

    if (searchValue != undefined) {
      queryParams = queryParams.append('Search', searchValue);
    }
    if (type != undefined) {
      queryParams = queryParams.append('Type', type);
    }
    if (sortBy != undefined) {
      queryParams = queryParams.append('SortBy', sortBy);
    }
    if (sortOrder != undefined) {
      queryParams = queryParams.append('SortOrder', sortOrder);
    }
    return this.http.get(url, { params: queryParams });
  }

  deletePresentation(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/presentations/delete/${id}`;
    return this.http.delete(url);
  }

  updateStatus(id: number, status: any) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_PRESENTATION_STATUS
    }/${id}`;
    let formData = new FormData();
    formData.append('Status', status);
    return this.http.post(url, formData);
  }

  viewPresentation(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/presentations/details/${id}`;
    return this.http.get(url);
  }

  async getCategories(): Promise<Observable<any>> {
    await this.loadPrsentationCategoryTypes();
    return this.CategoryTypes$;
  }

  deleteFile(id: number) {
    let url: string = `${environment.apiBaseUrl}/presentations/deletefile/${id}`;
    //let queryParams = new HttpParams();
    // queryParams = queryParams.append('Type', type);
    return this.http.delete(url);
  }

  private checkSession(key: string) {
    return sessionStorage.getItem(key) != undefined;
  }

  async loadPrsentationCategoryTypes() {
    let url: string = `${environment.apiBaseUrl}/presentationcategory/list`;

    const loadCategories$ = this.http.get(url).pipe(
      map((res: any) => res.data),

      catchError((error: any) => {
        return throwError(() => new error(error));
      }),

      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.PRESENTATION_CATEGORY_TYPES,
          JSON.stringify(data)
        );

        this.CategoryTypesSubject.next(data);
      })
    );

    loadCategories$.subscribe();
  }

  // getAllFrontendPresentation(filter: any): Observable<any> {
  //   let url: string = `${
  //     environment.apiBaseUrl + API_ROUTE.GET_FRONTEND_PRESENTATION
  //   }`;
  //   let queryParams = new HttpParams();
  //   Object.keys(filter).forEach((key: string) => {
  //     if (filter[key] !== undefined && filter[key] != null) {
  //       queryParams = queryParams.append(key, filter[key]);
  //     }
  //   });
  //   return this.http
  //     .get(url, { params: queryParams })
  //     .pipe(map((res: any) => res.data));
  // }

  getAllFrontendPresentation(filter: any, slug?: any): Observable<any> {
    let url: string = '';
    if (slug != '' && slug != undefined) {
      url = `${
        environment.apiBaseUrl + API_ROUTE.GET_FRONTEND_PRESENTATION
      }/${slug}`;
    } else {
      url = `${environment.apiBaseUrl + API_ROUTE.GET_FRONTEND_PRESENTATION}`;
    }
    let queryParams = new HttpParams();
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
    let url: string = `${environment.apiBaseUrl}/frontend/menu/quicklinks/announcements-and-webcasts`;
    return this.http.get(url);
  }

  getFilterYears() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PRESENTATIONS_YEARS}`;
    return this.http.get(url);
  }
}

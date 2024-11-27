import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
import { API_ROUTE, CONSTANTS, SESSION } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  CategoryTypesSubject = new BehaviorSubject<any[]>([]);
  financialYearsSubject = new BehaviorSubject<any[]>([]);
  presentationsSubject = new BehaviorSubject<any[]>([]);

  CategoryTypes$ = this.CategoryTypesSubject.asObservable();
  financialYears$ = this.financialYearsSubject.asObservable();
  presentations$ = this.presentationsSubject.asObservable();
  constructor(private http: HttpClient) {}

  getAllEvents(payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/events/listing`;
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

  updateStatus(id: number, status: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.UPDATE_EVENT_STATUS}/${id}`;
    let formData = new FormData();
    formData.append('Status', status);
    return this.http.post(url, formData);
  }

  viewEvent(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/events/details/${id}`;
    return this.http.get(url);
  }

  async loadEventCategoryTypes() {
    let url: string = `${environment.apiBaseUrl}/eventcategory/list`;

    const loadCategories$ = this.http
      .get(url, {
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(
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

  private checkSession(key: string) {
    return sessionStorage.getItem(key) != undefined;
  }

  async getCategories(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.EVENT_CATEGORY_TYPES)) {
      this.CategoryTypesSubject.next(
        JSON.parse(sessionStorage.getItem(SESSION.EVENT_CATEGORY_TYPES) || '[]')
      );
    } else {
      await this.loadEventCategoryTypes();
    }

    return this.CategoryTypes$;
  }

  async loadFinancialResults() {
    let url: string = `${environment.apiBaseUrl}/financialresults/listing`;

    const loadFinancialResults$ = this.http.get(url).pipe(
      map((res: any) => res.data),

      catchError((error: any) => {
        return throwError(() => new error(error));
      }),

      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.FINANCIAL_YEARS_DROPDOWN,
          JSON.stringify(data)
        );

        this.financialYearsSubject.next(data);
      })
    );

    loadFinancialResults$.subscribe();
  }

  async getFinancialResults(): Promise<Observable<any>> {
    // if (this.checkSession(SESSION.FINANCIAL_YEARS_DROPDOWN)) {
    //   this.financialYearsSubject.next(
    //     JSON.parse(sessionStorage.getItem(SESSION.FINANCIAL_YEARS_DROPDOWN) || '[]')
    //   );
    // }
    //  else {
    await this.loadFinancialResults();
    // }

    return this.financialYears$;
  }

  async loadPresentations() {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Type', 1);
    let url: string = `${environment.apiBaseUrl}/presentations/listing`;

    const loadPresentations$ = this.http.get(url, { params: queryParams }).pipe(
      map((res: any) => res.data),

      catchError((error: any) => {
        return throwError(() => new error(error));
      }),

      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.PRESENTATIONS_DROPDOWN,
          JSON.stringify(data)
        );

        this.presentationsSubject.next(data);
      })
    );

    loadPresentations$.subscribe();
  }

  async getPresentations(): Promise<Observable<any>> {
    // if (this.checkSession(SESSION.PRESENTATIONS_DROPDOWN)) {
    //   this.presentationsSubject.next(
    //     JSON.parse(sessionStorage.getItem(SESSION.PRESENTATIONS_DROPDOWN) || '[]')
    //   );
    // } else {
    await this.loadPresentations();
    //  }

    return this.presentations$;
  }

  createEvent(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/events/add`;
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

  updateEvent(payload: any, id: number): Observable<any> {
    let url = `${environment.apiBaseUrl}/events/update/${id}`;
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

  deleteFile(id: number, type: any) {
    let url: string = `${environment.apiBaseUrl}/events/deletefile/${id}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Column', type);
    return this.http.delete(url, { params: queryParams });
  }

  getAllFrontendEvents(payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/frontend/events/list`;
    let params = new HttpParams();
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });
    return this.http
      .get(url, {
        params: params,
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(map((res: any) => res.data.events));
  }

  getQuickLinks() {
    let url: string = `${environment.apiBaseUrl}/frontend/menu/quicklinks/events-calendar`;
    return this.http.get(url);
  }

  getInvestorsRouterLinks(name: any, slug?: any): any {
    switch (name) {
      case 'events':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/investors', Name: 'Investors / ' },
          { path: '/investors/events-calendar', Name: 'IR Events Calendar' },
        ];
      case 'sens-announcements':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/investors', Name: 'Investors / ' },
          {
            path: '/investors/investor-information/sens-announcements',
            Name: 'Investor Information / ',
          },
          {
            path: '/investors/investor-information/sens-announcements',
            Name: 'SENS announcements',
          },
        ];
      case 'press-office':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/press-office', Name: 'Press Office  ' },
        ];
      case 'press-office-details':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/press-office', Name: 'Press Office / ' },
          { path: '/press-office-details/' + slug, Name: slug },
        ];

      case 'presentation':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/investors', Name: 'Investors / ' },
          {
            path: '/investors/announcements-and-webcasts',
            Name: 'Announcements and webcast',
          },
        ];

      case 'presentation-details':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/presentation-details', Name: 'Presentation / ' },
          { path: '/investors/presentations' + slug, Name: slug },
        ];

      case 'debt-programme':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/investors', Name: 'Investors / ' },
          {
            path: '/investors/investor-information/debt-programme',
            Name: 'Investor Information / ',
          },
          {
            path: '/investors/investor-information/debt-programme',
            Name: 'Debt Programme & Credit Ratings',
          },
        ];
      case 'financial-results':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/investors', Name: 'Investors / ' },
          {
            path: '/investors/financial-results',
            Name: 'Financial Results ',
          },
          {
            path: '/investors/financial-results',
            Name: '',
          },
        ];

      case 'integrated-reports':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/investors', Name: 'Investors / ' },
          {
            path: '/investors/integrated-reports',
            Name: 'Integrated reports / ',
          },
          {
            path: '/investors/integrated-reports',
            Name: new Date().getFullYear() + ' ' + 'Reporting',
          },
        ];
      case 'circulars':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/investors', Name: 'Investors / ' },
          {
            path: '/investors/investor-information/circulars',
            Name: 'Investor Information / ',
          },
          {
            path: '/investors/investor-information/circulars',
            Name: 'Circulars',
          },
        ];
      case 'form-dsar':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/data-subject-request', Name: 'Data Subject Request' },
        ];
    }
  }
}

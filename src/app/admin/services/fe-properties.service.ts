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
export class FePropertiesService {
  private unitTabSubject = new BehaviorSubject<number>(0);
  unitTab$ = this.unitTabSubject.asObservable();

  totalSubject = new BehaviorSubject<number>(0);
  totalProperties = this.totalSubject.asObservable();

  provincesSubject = new BehaviorSubject<any[]>([]);
  province$ = this.provincesSubject.asObservable();

  provincesSASubject = new BehaviorSubject<any[]>([]);
  provinceSA$ = this.provincesSASubject.asObservable();

  citySubject = new BehaviorSubject<any[]>([]);
  city$ = this.citySubject.asObservable();

  cityInternationalSubject = new BehaviorSubject<any[]>([]);
  cityInternational$ = this.cityInternationalSubject.asObservable();

  suburbSubject = new BehaviorSubject<any[]>([]);
  suburb$ = this.suburbSubject.asObservable();

  suburbInternationalSubject = new BehaviorSubject<any[]>([]);
  suburbInternational$ = this.suburbInternationalSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllPropertyUnits(filter: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/frontend/propertyunit/getallunits`;
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

  getPropertyUnitFE(slug: any, filter?: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/frontend/property/units/available/${slug}`;
    let params = new HttpParams();
    if (filter) {
      Object.keys(filter).forEach((key: string) => {
        if (filter[key] != undefined) {
          params = params.append(key, filter[key]);
        }
      });
    }
    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }

  setDefaultTab(tab: number) {
    this.unitTabSubject.next(tab);
  }

  setCount(count: number) {
    this.totalSubject.next(count);
  }

  // for International

  async getProvinces(type: number): Promise<Observable<any>> {
    await this.loadProvinces(type);
    return this.province$;
  }

  async loadProvinces(type: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Type', type);
    queryParams = queryParams.append('Used', 1);
    let url: string = `${environment.apiBaseUrl}/province/list`;
    const loadProvince$ = this.http.get(url, { params: queryParams }).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        this.provincesSubject.next(data);
      })
    );
    loadProvince$.subscribe();
  }

  async getCity(provinceId: number): Promise<Observable<any>> {
    await this.loadCities(provinceId);
    return this.city$;
  }

  async loadCities(type: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('ProvinceId', type);
    queryParams = queryParams.append('Type', 1);
    let url: string = `${environment.apiBaseUrl}/city/list`;
    const loadCity$ = this.http.get(url, { params: queryParams }).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        this.citySubject.next(data);
      })
    );
    loadCity$.subscribe();
  }

  async getCityInternational(type: number): Promise<Observable<any>> {
    await this.loadCitiesInternational(type);
    return this.cityInternational$;
  }

  async loadCitiesInternational(type: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Type', type);
    queryParams = queryParams.append('Used', 1);
    let url: string = `${environment.apiBaseUrl}/city/list`;
    const loadCityInternational$ = this.http
      .get(url, { params: queryParams })
      .pipe(
        map((res: any) => res.data),
        catchError((error: any) => {
          return throwError(() => new error(error));
        }),
        tap((data: any) => {
          this.cityInternationalSubject.next(data);
        })
      );
    loadCityInternational$.subscribe();
  }

  async getSuburb(type: number): Promise<Observable<any>> {
    await this.loadSuburb(type);
    return this.suburb$;
  }

  async loadSuburb(type: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('CityId', type);
    queryParams = queryParams.append('Type', 1);
    let url: string = `${environment.apiBaseUrl}/suburb/list`;
    const loadSuburb$ = this.http.get(url, { params: queryParams }).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        this.suburbSubject.next(data);
      })
    );
    loadSuburb$.subscribe();
  }

  async getSuburbInternational(type: number): Promise<Observable<any>> {
    await this.loadSuburbInternational(type);
    return this.suburbInternational$;
  }

  async loadSuburbInternational(type: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Type', type);
    queryParams = queryParams.append('Used', 1);
    let url: string = `${environment.apiBaseUrl}/suburb/list`;
    const loadSuburbInternational$ = this.http
      .get(url, { params: queryParams })
      .pipe(
        map((res: any) => res.data),
        catchError((error: any) => {
          return throwError(() => new error(error));
        }),
        tap((data: any) => {
          this.suburbInternationalSubject.next(data);
        })
      );
    loadSuburbInternational$.subscribe();
  }

  getAllFEInternationalProperties(filter: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/frontend/property/list`;
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

  getAllFESouthAfricanProperties(filter: any): Observable<any> {
    filter.Type = 1;
    let url = `${environment.apiBaseUrl}/frontend/property/list`;
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

  getHoldinngCompanyDropdown() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_HOLDING_COMPANIES}`;
    return this.http.get(url);
  }

  getESGDropdown() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_ESG_DROPDOWN}`;
    let params = new HttpParams();
    params = params.append('Used', 1);
    return this.http.get(url, { params: params });
  }

  getGrossRentalMax(type: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_GROSS_RENTAL_MAX}`;
    let params = new HttpParams();
    params = params.append('Type', type);
    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }

  // for south african

  async getSACities(used?: any): Promise<Observable<any>> {
    await this.loadSACities(used);
    return this.city$;
  }

  async loadSACities(used?: any) {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_CITIES}`;
    let queryParams = new HttpParams();
    if (used != undefined) {
      queryParams = queryParams.append('Used', 1);
    }
    const loadCity$ = this.http.get(url, { params: queryParams }).pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        this.citySubject.next(data);
      })
    );
    loadCity$.subscribe();
  }

  async getSASuburb(used?: any): Promise<Observable<any>> {
    await this.loadSASuburb(used);

    return this.suburb$;
  }

  async getAllSALocation(used?: any, type?: any): Promise<Observable<any>> {
    await this.loadSALocation(used, type);
    return this.suburb$;
  }

  async loadSALocation(used?: any, type?: any) {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_LOCATION}`;
    let queryParams = new HttpParams();
    if (used != undefined) {
      queryParams = queryParams.append('Used', 1);
    }
    if (type != undefined) {
      queryParams = queryParams.append('Type', 1);
    }
    const loadSuburb$ = this.http.get(url, { params: queryParams }).pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        this.suburbSubject.next(data);
      })
    );
    loadSuburb$.subscribe();
  }

  async loadSASuburb(used?: any) {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_SUBURB}`;
    let queryParams = new HttpParams();
    if (used != undefined) {
      queryParams = queryParams.append('Used', 1);
    }
    const loadSuburb$ = this.http.get(url, { params: queryParams }).pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        this.suburbSubject.next(data);
      })
    );
    loadSuburb$.subscribe();
  }

  async getSAProvinces(used?: any): Promise<Observable<any>> {
    await this.loadSAProvinces(used);
    return this.provinceSA$;
  }

  async loadSAProvinces(used?: any) {
    let url: string = `${environment.apiBaseUrl}/province/list`;
    let queryParams = new HttpParams();
    if (used != undefined) {
      queryParams = queryParams.append('Used', 1);
    }
    const loadProvince$ = this.http.get(url, { params: queryParams }).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        this.provincesSASubject.next(data);
      })
    );
    loadProvince$.subscribe();
  }
}

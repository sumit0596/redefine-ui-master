import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { API_ROUTE, SESSION } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class DataStoreService {
  countriesSubject = new BehaviorSubject<any>([]);
  sectorSubject = new BehaviorSubject<any>([]);
  provinceSubject = new BehaviorSubject<any>([]);

  constructor(private httpClient: HttpClient) {}

  async getCountries(): Promise<Observable<any>> {
    await this.loadCountries();
    return this.countriesSubject.asObservable();
  }
  async getSector(type: number): Promise<Observable<any>> {
    // let sector = JSON.parse(sessionStorage.getItem(SESSION.SECTORS) || '[]');
    // if (sector.length) {
    //   this.sectorSubject.next(sector);
    //   return of(sector);
    // } else {
    await this.loadSector(type);
    // }
    return this.sectorSubject.asObservable();
  }
  async getProvince(): Promise<Observable<any>> {
    let province = JSON.parse(
      sessionStorage.getItem(SESSION.PROVINCES) || '[]'
    );
    if (province.length) {
      this.provinceSubject.next(province);
      return of(province);
    } else {
      await this.loadProvinces();
    }
    return this.provinceSubject.asObservable();
  }

  async loadCountries() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_COUNTRIES}`;
    const loadCountries$ = this.httpClient.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.COUNTRIES, JSON.stringify(data));
        this.countriesSubject.next(data);
      })
    );
    loadCountries$.subscribe();
  }

  async loadSector(type: number) {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_SECTORS}`;
    let queryParams = new HttpParams();
    if (type == 1) {
      queryParams = queryParams.append('Type', type);
    }
    const loadSectors$ = this.httpClient.get(url, { params: queryParams }).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.SECTORS, JSON.stringify(data));
        this.sectorSubject.next(data);
      })
    );
    loadSectors$.subscribe();
  }

  async loadProvinces() {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_PROVINCES}`;
    const loadProvince$ = this.httpClient.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.PROVINCES, JSON.stringify(data));
        this.provinceSubject.next(data);
      })
    );
    loadProvince$.subscribe();
  }
}

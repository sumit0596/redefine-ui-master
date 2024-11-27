import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  retry,
  tap,
  throwError,
} from 'rxjs';
import { API_ROUTE, CONSTANTS, SESSION } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';
import { FrontendService } from './frontend.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderMenuService {
  headerMenuSubject = new BehaviorSubject<any[]>([]);
  headerMenu$ = this.headerMenuSubject.asObservable();

  constructor(private httpClient: HttpClient) {}
  async getHeaderMenu(): Promise<Observable<any>> {
    return this.headerMenu$;
  }

  async loadHeaderMenu() {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.FRONTEND_HEADER_MENU
    }`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Portal', 1);

    const loadHeaderMenu$ = this.httpClient
      .get<any>(url, {
        params: queryParams,
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(
        retry(1),
        map((res) => {
          return res.data;
        }),
        catchError((error: any) => {
          return throwError(() => new error(error));
        }),
        tap((data) => this.headerMenuSubject.next(data))
      );
    return loadHeaderMenu$;
  }

  getMarketData(): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/${API_ROUTE.MARKET_DATA}`;
    return this.httpClient
      .get(url, {
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(
        map((res: any) => {
          return [...res.data].map((d: any) => {
            return {
              code: d.Code,
              price: d.Trade,
              previousClose: d.PreviousClose,
              movement: d.Perc,
              LastTradeTime: d.LastTradeTime,
            };
          });
        })
      );
  }
}

import { HttpClient } from '@angular/common/http';
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
export class AdminService {
  userMenuSubject = new BehaviorSubject<any[]>([]);
  userMenu$ = this.userMenuSubject.asObservable();

  constructor(private httpClient: HttpClient) {}
  async getMenu(): Promise<Observable<any>> {
    return this.userMenu$;
  }

  async loadMenu() {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.ADMIN_LEFT_MENU}`;
    const loadMenu$ = this.httpClient.get<any>(url).pipe(
      map((res) => {
        sessionStorage.setItem(SESSION.USER_MENU, JSON.stringify(res.data));
        return res.data;
      }),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data) => this.userMenuSubject.next(data))
    );
    return loadMenu$;
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, of, tap } from 'rxjs';
import { API_ROUTE, CONSTANTS, SESSION } from 'src/app/models/constants';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment.dev';
import { UserStoreService } from '../user-store.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private httpClient: HttpClient,
    private userStore: UserStoreService
  ) {}
  login(formData: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.USER_LOGIN}`;
    return this.httpClient.post(url, formData).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.JWT_TOKEN, data.Token);
        sessionStorage.setItem(SESSION.TOKEN_TAT, data.ExpiresIn);
        this.userStore.setUser(data.User);
      })
    );
  }
  adLogin(): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.AD_LOGIN}`;
    return this.httpClient.post<any>(url, { withCredentials: true }).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.JWT_TOKEN, data.Token);
        sessionStorage.setItem(SESSION.TOKEN_TAT, data.ExpiresIn);
        this.userStore.setUser(data.User);
      })
    );
  }
  async logout() {
    sessionStorage.clear();
    localStorage.clear();
  }
  // async saveUser(user: any, tokenData: any) {
  //   sessionStorage.setItem(SESSION.JWT_TOKEN, tokenData.Token);
  //   sessionStorage.setItem(SESSION.TOKEN_TAT, tokenData.ExpiresIn);
  //   sessionStorage.setItem(SESSION.USER, JSON.stringify(user));
  // }
  // async getUser(): Promise<Observable<any>> {
  //   const user = sessionStorage.getItem(CONSTANTS.USER);
  //   if (user) {
  //     return of(JSON.parse(user));
  //   }
  //   return of(false);
  // }
  getToken(): string | null {
    return sessionStorage.getItem(SESSION.JWT_TOKEN);
  }
  validateResetPasswordToken(token: string): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.RESET_PASSWORD_TOKEN_CHECK
    }`;
    let formData = new FormData();
    formData.append('Token', token);
    return this.httpClient.post(url, formData);
  }
  isLoggedIn(): boolean {
    if (sessionStorage.getItem(CONSTANTS.USER)) {
      return true;
    }
    return false;
  }
  forgotPassword(formData: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.FORGOT_PASSWORD}`;
    return this.httpClient.post(url, formData);
  }
  resetPassword(formData: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.RESET_PASSWORD}`;
    return this.httpClient.post(url, formData);
  }
  refreshToken(): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.REFRESH_TOKEN}`;
    return this.httpClient.post(url, {}).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.JWT_TOKEN, data.Token);
        sessionStorage.setItem(SESSION.TOKEN_TAT, data.ExpiresIn);
        this.userStore.setUser(data.User);
      })
    );
  }
}

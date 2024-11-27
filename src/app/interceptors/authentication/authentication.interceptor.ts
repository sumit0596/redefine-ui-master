import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { API_ROUTE, ROUTE, SESSION } from 'src/app/models/constants';
import { LoginService } from 'src/app/services/login/login.service';
import { Router } from '@angular/router';
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  token!: string | null;
  refreshTokenInProgress = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private loginService: LoginService, private router: Router) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.token = sessionStorage.getItem(SESSION.JWT_TOKEN);
    if (environment.apiToken) {
      let clonedRequest = this.addAuthenticationToken(request);
      return next.handle(clonedRequest).pipe(
        finalize(() => {}),
        catchError((error: HttpErrorResponse) => {
          if (clonedRequest.url.includes(API_ROUTE.REFRESH_TOKEN)) {
            sessionStorage.removeItem(SESSION.USER);
            sessionStorage.removeItem(SESSION.JWT_TOKEN);

            this.router.navigate([ROUTE.LOGIN]);
          }
          if (
            this.loginService.isLoggedIn() &&
            error &&
            error.status === HttpStatusCode.Unauthorized
          ) {
            // 401 errors are most likely going to be because we have an expired token that we need to refresh.
            if (this.refreshTokenInProgress) {
              // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
              // which means the new token is ready and we can retry the request again
              return this.refreshTokenSubject.pipe(
                filter((result) => result !== null),
                take(1),
                switchMap(() =>
                  next.handle(this.addAuthenticationToken(request))
                ),
                catchError((error: HttpErrorResponse) => {
                  if (error && error.status === HttpStatusCode.Unauthorized) {
                    this.router.navigate([ROUTE.LOGIN]);
                  }
                  return throwError(() => {
                    return error;
                  });
                })
              );
            } else {
              this.token = null;
              this.refreshTokenInProgress = true;
              // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
              this.refreshTokenSubject.next(null);
              return this.refreshAccessToken().pipe(
                tap((result: any) => {
                  this.token = result.data.Token;
                }),
                switchMap((success: boolean) => {
                  this.refreshTokenSubject.next(success);
                  return next.handle(this.addAuthenticationToken(request));
                }),
                // When the call to refreshToken completes we reset the refreshTokenInProgress to false
                // for the next time the token needs to be refreshed
                finalize(() => (this.refreshTokenInProgress = false)),
                catchError((error: HttpErrorResponse) => {
                  if (error && error.status === HttpStatusCode.Unauthorized) {
                    this.router.navigate([ROUTE.LOGIN]);
                  }
                  return throwError(() => {
                    return error;
                  });
                })
              );
            }
          } else {
            return throwError(() => {
              return error;
            });
          }
        })
      );
    } else {
      return next.handle(request);
    }
  }
  private refreshAccessToken(): Observable<any> {
    return this.loginService.refreshToken();
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      params: request.params.set('ApiToken', environment.apiToken),
      headers: this.token
        ? request.headers.set('authorization', 'Bearer ' + this.token)
        : request.headers,
    });
  }
}

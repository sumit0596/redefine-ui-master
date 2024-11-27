import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { API_ROUTE, CONSTANTS } from 'src/app/models/constants';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Show the loader when a request is made
    if (
      !request.url.includes('analytics') &&
      !request.url.includes(API_ROUTE.USER_AD_LOGIN) &&
      !request.url.includes(API_ROUTE.GET_ALL_MENU_LIST) &&
      !request.headers.has(CONSTANTS.SKIP_LOADER)
    ) {
      this.loaderService.show();
    }
    // Pass the request to the next handler
    return next.handle(request).pipe(
      // Hide the loader when the response is received or an error occurs
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }
}

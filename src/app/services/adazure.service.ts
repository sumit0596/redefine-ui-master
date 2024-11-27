import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  MsalService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
} from '@azure/msal-angular';
import {
  AuthenticationResult,
  PopupRequest,
  RedirectRequest,
} from '@azure/msal-browser';
import { API_ROUTE, SESSION, CONSTANTS } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';
import { ContextContainer } from 'src/app/core/context/context-container';
import { UserStoreService } from 'src/app/services/user-store.service';

@Injectable({
  providedIn: 'root',
})
export class AdAzureService {
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private httpClient: HttpClient,
    private context: ContextContainer,
    private userStore: UserStoreService,
    private router: Router
  ) {}

  adLogin() {
    if (this.authService.instance.getAllAccounts().length > 0) {
      if (sessionStorage.getItem('user')) {
        this.router.navigate(['admin']);
      } else {
        this.webLogin(
          this.authService.instance.getAllAccounts()[0]['username']
        );
      }
      return false;
    } else {
      this.context.loaderService.show(CONSTANTS.AZURE_BEFORE_MSG, 'AD_LOGIN');
      if (this.msalGuardConfig.authRequest) {
        return this.authService.loginRedirect({
          ...this.msalGuardConfig.authRequest,
        } as RedirectRequest);
      } else {
        return this.authService.loginRedirect();
      }
    }
  }

  adLogin2() {
    if (this.msalGuardConfig.authRequest) {
      this.authService
        .loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    } else {
      this.authService
        .loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    }
  }

  adLogout() {
    this.authService.logoutRedirect({
      onRedirectNavigate: () => false,
    });
  }
  adWebLogin(email: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.USER_AD_LOGIN}`;
    const body = new HttpParams().set('UserName', email);
    return this.httpClient.post(url, body);
  }

  webLogin(email: any) {
    this.context.loaderService.show(CONSTANTS.AZURE_AFTER_MSG, 'AD_LOGIN');
    this.adWebLogin(email).subscribe({
      next: (res: any) => {
        if (res.status == 'success') {
          sessionStorage.setItem(SESSION.JWT_TOKEN, res.data.Token);
          sessionStorage.setItem(SESSION.TOKEN_TAT, res.data.ExpiresIn);
          this.userStore.setUser(res.data.User);
          this.router.navigate(['admin']).then((value: boolean) => {
            this.context.toasterService.success(res.message);
          });
        } else {
          this.adLogout();
          this.router.navigate(['login']).then((value: boolean) => {
            this.context.toasterService.error(res.message);
          });
        }
      },
      complete: () => {},
      error: (error) => {
        this.router.navigate(['login']).then((value: boolean) => {
          this.context.toasterService.error(error.message);
        });
        this.adLogout();
      },
    });
  }
}

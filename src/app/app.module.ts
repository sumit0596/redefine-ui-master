import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthenticationInterceptor } from './interceptors/authentication/authentication.interceptor';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ContextContainer } from './core/context/context-container';
import {
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalService,
  MsalGuard,
  MsalRedirectComponent,
  MsalModule,
} from '@azure/msal-angular';
import { LoaderInterceptor } from './interceptors/loader/loader.interceptor';
import {
  MSALGuardConfigFactory,
  MSALInstanceFactory,
  MSALInterceptorConfigFactory,
} from './utilities/ad-login';
import { ServiceWorkerModule } from '@angular/service-worker';
import { GlobalErrorHandler } from './utilities/global-error-handler';
import { SafeHtmlPipe } from './shared/pipes/safe-html.pipe';
import { environment } from 'src/environments/environment.dev';
import { MatDialogModule } from '@angular/material/dialog';
import { MaintenanceComponent } from "./frontend/shared/maintenance/maintenance.component";

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent, MsalRedirectComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 2000,
            extendedTimeOut: 2000,
        }),
        MsalModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerImmediately',
        }),
        MatDialogModule,
        MaintenanceComponent], providers: [
        DatePipe,
        SafeHtmlPipe,
        TitleCasePipe,
        ContextContainer,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true,
        },
        {
            provide: MSAL_INSTANCE,
            useFactory: MSALInstanceFactory,
        },
        {
            provide: MSAL_GUARD_CONFIG,
            useFactory: MSALGuardConfigFactory,
        },
        {
            provide: MSAL_INTERCEPTOR_CONFIG,
            useFactory: MSALInterceptorConfigFactory,
        },
        MsalService,
        MsalGuard,
        MsalBroadcastService,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}

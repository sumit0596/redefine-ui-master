import {
  BrowserCacheLocation,
  IPublicClientApplication,
  InteractionType,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import {
  MsalInterceptorConfiguration,
  MsalGuardConfiguration,
} from '@azure/msal-angular';
import { environment } from 'src/environments/environment.dev';



  const REDIRECT_URI =  (environment.ENV_TYPE==1) ? 'http://localhost:4200/.auth/login/aadb2c/callback' : (environment.ENV_TYPE==2) ?'https://uat.redefine.co.za/.auth/login/aadb2c/callback' : 'https://redefine.co.za/.auth/login/aadb2c/callback';
  const GRAPH_ENDPOINT =  'https://graph.microsoft.com/v1.0/me';
  const CLIENT_ID =  (environment.ENV_TYPE==1) ? '1899498e-332c-451e-af34-009627be84b3' : (environment.ENV_TYPE==2) ?'f5839dca-be4b-4348-b0e9-786eeaf88d71' : 'ba04b0ed-2059-4793-8b1f-d869decf619b';
  const AUTHORITY =  (environment.ENV_TYPE==1) ? 'https://login.microsoftonline.com/ceecc926-0c8f-48d1-b01b-b17091c7d7f5' : (environment.ENV_TYPE==2) ?'https://login.microsoftonline.com/79eeeebb-af45-44c1-ae28-b6b489fa76c7' : 'https://login.microsoftonline.com/79eeeebb-af45-44c1-ae28-b6b489fa76c7';
  
 


const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

export const loggerCallback = (logLevel: LogLevel, message: string) => {};

export const MSALInstanceFactory = (): IPublicClientApplication => {
  return new PublicClientApplication({
    auth: {
      clientId: CLIENT_ID,
      authority: AUTHORITY,
      redirectUri: REDIRECT_URI,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
};

export const MSALInterceptorConfigFactory =
  (): MsalInterceptorConfiguration => ({
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map([[GRAPH_ENDPOINT, ['user.read']]]),
  });

export const MSALGuardConfigFactory = (): MsalGuardConfiguration => {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read'],
    },
  };
};

// export loggerCallback;
// export MSALInstanceFactory;
// export MSALInterceptorConfigFactory;
// export MSALGuardConfigFactory;

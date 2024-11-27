import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthenticationInterceptor } from 'src/app/interceptors/authentication/authentication.interceptor';
import { credentials, unauthorized, user } from 'src/mocks';
import { LoginService } from './login.service';

fdescribe('LoginService', () => {
  let loginService: LoginService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    loginService = new LoginService(httpClientSpy);
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true,
        },
        {
            provide: HttpClient,
            useValue: httpClientSpy,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
    loginService = TestBed.inject(LoginService);
  });

  fit('login service should be created', () => {
    expect(loginService).toBeTruthy();
  });

  fit('login() should return user data and called 1 time', (done: DoneFn) => {
    const expectedRes = user;
    httpClientSpy.post.and.returnValue(of(expectedRes));
    loginService.login(credentials).subscribe({
      next: (res) => {
        expect(res).withContext('user data').toEqual(expectedRes);
        done();
      },
      error: (error) => {
        done.fail;
      },
    });
    expect(httpClientSpy.post.calls.count()).withContext('One call').toEqual(1);
  });
  fit('AD login should return user data', (done: DoneFn) => {
    const expectedRes = user;
    httpClientSpy.post.and.returnValue(of(expectedRes));
    loginService.adLogin().subscribe({
      next: (res) => {
        expect(res).withContext('user data').toEqual(expectedRes);
        done();
      },
      error: (error) => {
        done.fail;
      },
    });
    expect(httpClientSpy.post.calls.count()).withContext('One call').toEqual(1);
  });
  fit('AD login should return 401 if unathorized', (done: DoneFn) => {
    const expectedRes = unauthorized;
    httpClientSpy.post.and.returnValue(of(expectedRes));
    loginService.adLogin().subscribe({
      next: (res) => {
        expect(res).withContext('user data').toEqual(expectedRes);
        done.fail;
      },
      error: (error) => {
        expect(error.statusCode).withContext('status code').toEqual(401);
        done();
      },
    });
    expect(httpClientSpy.post.calls.count()).withContext('One call').toEqual(1);
    done();
  });
});

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';
import { SharedModule } from '../../shared.module';
import { user } from 'src/mocks/';

import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: LoginComponent;
let page: Page;
let fixture: ComponentFixture<LoginComponent>;
let routerSpy!: Router; //jasmine.createSpyObj('Router', ['navigate',]);
const loginServiceSpy = jasmine.createSpyObj('LoginService', [
  'login',
  'adLogin',
  'saveUser',
  'forgotPassword',
]);

fdescribe('LoginComponent', () => {
  let loginSpy;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [LoginComponent],
    imports: [ReactiveFormsModule,
        RouterTestingModule,
        SharedModule, ToastrModule.forRoot()],
    providers: [
        {
            provide: LoginService,
            useValue: loginServiceSpy,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginSpy = loginServiceSpy.login.and.returnValue(of(user));
    page = new Page();
    fixture.detectChanges();
  });
  beforeEach(() => {
    routerSpy = TestBed.inject(Router);
    spyOn(routerSpy, 'navigate');
  });

  fdescribe('with shallow test', () => {
    fit('should create login component', () => {
      expect(component).toBeTruthy();
    });
    fit('should create form with login and password input and login button', (done: DoneFn) => {
      expect(page.greetingMsg).toBeDefined();
      expect(page.email).toBeDefined();
      expect(page.password).toBeDefined();
      expect(page.loginBtn).toBeDefined();
      done();
    });
    fit('forgot password button should be redered', (done: DoneFn) => {
      expect(page.forgotBtn)
        .withContext('forgot password button')
        .toBeDefined();
      done();
    });
  });

  fdescribe('with integrated test', () => {
    fit('login button should call loginService login() ', (done: DoneFn) => {
      page.loginBtn.click();
      fixture.detectChanges();
      expect(loginServiceSpy.login).toHaveBeenCalled();
      done();
    });
    fit('should route to the dashboard if login is successful', (done: DoneFn) => {
      loginSpy = loginServiceSpy.login.and.returnValue(of(user));
      page.loginBtn.click();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['admin']);
      done();
    });
    fit('forgot password click should change form type to 2', (done: DoneFn) => {
      page.forgotBtn.click();
      fixture.detectChanges();
      expect(component.formType).toEqual(2);
      done();
    });
    fit('forgot password click should render send request and back to login button', (done: DoneFn) => {
      page.forgotBtn.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(page.sendRequestBtn).toBeDefined();
        expect(page.backBtn).toBeDefined();
        done();
      });
    });
    fit('send request should call loginService forgotPassword()', (done: DoneFn) => {
      component.formType = 2;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        page.sendRequestBtn.click();
        fixture.detectChanges();
        expect(loginServiceSpy.forgotPassword).toHaveBeenCalled();
        done();
      });
    });
    fit('should change form type to 1, on back to login click', (done: DoneFn) => {
      component.formType = 2;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        page.backBtn.click();
        fixture.detectChanges();
        loginSpy = loginServiceSpy.login.and.returnValue(of(user));
        expect(component.formType).toEqual(1);
        done();
      });
    });
  });
});

/*********************************************************
 *                       Helpers                          *
 **********************************************************/

class Page {
  get greetingMsg() {
    return this.query('#greeting-msg');
  }
  get email() {
    return this.query<HTMLInputElement>('#email');
  }
  get password() {
    return this.query<HTMLInputElement>('#password');
  }
  get loginBtn() {
    return this.query<HTMLButtonElement>('#btn-login') as HTMLButtonElement;
  }
  get forgotBtn() {
    return this.query<HTMLButtonElement>(
      '#btn-forgot-password'
    ) as HTMLButtonElement;
  }
  get sendRequestBtn() {
    return this.query<HTMLButtonElement>(
      '#btn-send-request'
    ) as HTMLButtonElement;
  }
  get backBtn() {
    return this.query<HTMLButtonElement>('#btn-back') as HTMLButtonElement;
  }
  private query<T>(selector: string) {
    return fixture.debugElement.nativeElement.querySelector(selector);
  }
}

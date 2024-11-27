import { DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import {ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/admin/services/user.service';
import { InputComponent } from 'src/app/shared/components/form-elements/input/input.component';
import { SelectComponent } from 'src/app/shared/components/form-elements/select/select.component';

import { UserFormComponent } from './user-form.component';

fdescribe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let mockRouter: any;

  beforeEach(async () => {
   // const routerSpy = createRouterSpy();
    await TestBed.configureTestingModule({
    declarations: [UserFormComponent, InputComponent, SelectComponent],
    imports: [ReactiveFormsModule, RouterTestingModule, ToastrModule.forRoot(), NgSelectModule],
    providers: [DatePipe, provideHttpClient(withInterceptorsFromDi())]
})
      .compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit(`user registration`, fakeAsync(() => {
    let userServiceSpy = fixture.debugElement.injector.get(UserService);
    const resp = {
      message: "User has been added"
    }
    const payload =
    {
      "FirstName": "dgdfdhkjl",
      "LastName": "xvcvx",
      "Email": "xcvdc@gmail.com",
      "Password": "Abcd@1234",
      "Password_confirmation": "Abcd@1234",
      "CellNumber": "1234567890",
      "RoleId": "1",
      "OfficeNumber": "",
      "CompanyName": "",
      "ProvinceId": ""
    }
    fixture.componentInstance.userForm.value.FirstName = payload.FirstName;
    fixture.componentInstance.userForm.value.LastName = payload.LastName;
    fixture.componentInstance.userForm.value.Email = payload.Email;
    fixture.componentInstance.userForm.value.Password = payload.Password;
    fixture.componentInstance.userForm.value.Password_confirmation = payload.Password_confirmation;
    fixture.componentInstance.userForm.value.CellNumber = payload.CellNumber;
    fixture.componentInstance.userForm.value.RoleId = payload.RoleId;
    fixture.componentInstance.userForm.value.OfficeNumber = payload.OfficeNumber;
    fixture.componentInstance.userForm.value.CompanyName = payload.CompanyName;
    fixture.componentInstance.userForm.value.ProvinceId = payload.ProvinceId;
    const getStatusResponse = new Observable<any>(observer => {
      observer.next(resp);
    });
    spyOn(userServiceSpy, 'postUserRegister').withArgs(fixture.componentInstance.userForm.value)
      .and.returnValue((getStatusResponse));
    fixture.componentInstance.onSubmit();
    fixture.detectChanges;
    flush();
    expect(resp.message).toEqual("User has been added");
  }));


  fit(`Edit user`, fakeAsync(() => {
    let userServiceSpy = fixture.debugElement.injector.get(UserService);
    const resp = {
      message: "Data has been updated successfully"
    }
    const payload =
    {
      "FirstName": "dgdfdhkjl",
      "LastName": "xvcvx",
      "Email": "xcvdc@gmail.com",
      "Password": "Abcd@1234",
      "Password_confirmation": "Abcd@1234",
      "CellNumber": "1234567890",
      "RoleId": "1",
      "OfficeNumber": "",
      "CompanyName": "",
      "ProvinceId": ""
    }
    fixture.componentInstance.userForm.value.FirstName = payload.FirstName;
    fixture.componentInstance.userForm.value.LastName = payload.LastName;
    fixture.componentInstance.userForm.value.Email = payload.Email;
    fixture.componentInstance.userForm.value.Password = payload.Password;
    fixture.componentInstance.userForm.value.Password_confirmation = payload.Password_confirmation;
    fixture.componentInstance.userForm.value.CellNumber = payload.CellNumber;
    fixture.componentInstance.userForm.value.RoleId = payload.RoleId;
    fixture.componentInstance.userForm.value.OfficeNumber = payload.OfficeNumber;
    fixture.componentInstance.userForm.value.CompanyName = payload.CompanyName;
    fixture.componentInstance.userForm.value.ProvinceId = payload.ProvinceId;
    const getStatusResponse = new Observable<any>(observer => {
      observer.next(resp);
    });
    spyOn(userServiceSpy, 'editUser').withArgs(fixture.componentInstance.userForm.value, 1)
      .and.returnValue((getStatusResponse));
    fixture.componentInstance.onSubmit();
    fixture.detectChanges;
    flush();
    expect(resp.message).toEqual("Data has been updated successfully");
  }));

// need to write test cases for getting dropdowns
  // fit(`should fetch  Provinces`, fakeAsync(() => {
  //   component.roleList = [];
  //   let userServiceSpy = fixture.debugElement.injector.get(UserService);
  //   const resp = {
  //     data:[{"ProvinceId":1,"CountryId":1,"Name":"Cape Town","Status":1,"isDeleted":0,"CreatedOn":"2023-02-24T04:10:23.000000Z","UpdatedOn":"2023-02-24T04:10:23.000000Z"}]
  //   }
  //   const getStatusResponse = new Observable<any>(observer => {
  //     observer.next(resp);
  //  });
  //   // spyOn(userServiceSpy, 'getProvinces')
  //   //   .and.returnValue((getStatusResponse).subscribe());
  //   fixture.componentInstance.getProvinces();
  //   fixture.detectChanges;
  //   expect(undefined).toEqual(undefined);
  // }));

});



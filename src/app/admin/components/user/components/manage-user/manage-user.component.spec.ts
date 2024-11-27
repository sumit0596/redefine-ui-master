import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/admin/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { ManageUserComponent } from './manage-user.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

fdescribe('ManageUserComponent', () => {
  let component: ManageUserComponent;
  let fixture: ComponentFixture<ManageUserComponent>;
  let mockRouter;
  let RouterMock = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    mockRouter  = { navigate: jasmine.createSpy('navigate') };
    await TestBed.configureTestingModule({
    declarations: [ManageUserComponent],
    imports: [ReactiveFormsModule, ToastrModule.forRoot(), SharedModule, RouterModule, RouterTestingModule],
    providers: [{ provide: Router, useValue: RouterMock }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();

    fixture = TestBed.createComponent(ManageUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit(`should fetch  users`, fakeAsync(() => {
    let userServiceSpy = fixture.debugElement.injector.get(UserService);
    const resp = {
      data:{
      users:[
      {
        CellNumber: "Cape Town",
        Email: "alllls@gmail.com",
        FirstName :"John",
        LastName : "Kets",
        RoleName : "Admin",
        UserId: 21
      }],
      FullAccess:1,
      pageCount: "10",
      pageNumber: "1",
      totalUsers: 1,
      message: null,
      status: "success"
    }
  }

    const getStatusResponse = new Observable<any>(observer => {
      observer.next(resp);
    });
    spyOn(userServiceSpy, 'getAllUsers').withArgs(10,1)
      .and.returnValue((getStatusResponse));
    fixture.componentInstance.getAllUsers(10, 1);
    fixture.detectChanges;
    expect(component.totalRowsCount).toBe(resp.data.totalUsers);
  }));

  // need to work on this
  
  // fit(`should fetch  Roles`, fakeAsync(() => {
  //   component.roleList = [];
  //   let userServiceSpy = fixture.debugElement.injector.get(UserService);
  //   const resp = {
  //     data:[
  //     {
  //       "RoleId": 1,
  //       "Name": "Admin",
  //       "AddedBy": 0,
  //       "IsDeleted": 0,
  //       "CreatedOn": "2023-02-27T08:40:05.000000Z",
  //       "UpdatedOn": "2023-02-27T08:40:05.000000Z"
  //   },
  //   {
  //       "RoleId": 2,
  //       "Name": "Broker",
  //       "AddedBy": 0,
  //       "IsDeleted": 0,
  //       "CreatedOn": "2023-02-27T08:40:05.000000Z",
  //       "UpdatedOn": "2023-02-27T08:40:05.000000Z"
  //   }]
  // }
  //   const getStatusResponse = new Observable<any>(observer => {
  //     observer.next(resp.data);
  //   });
  //    spyOn(userServiceSpy, 'getRoles');
  //   //   .and.returnValue((getStatusResponse));
  //   fixture.componentInstance.getRoles();
  //   fixture.detectChanges;
  //   expect(component.roleList.length).toEqual(resp.data.length);
  // }));

  // fit(`Row actions-View`, fakeAsync(() => {
  //   const resp = {
  //     operation: "view",
  //     rowData:{
  //     UserId:1
  //     }
  // }
  //   fixture.componentInstance.rowActions(resp);
  //   fixture.detectChanges;
  //   expect(RouterMock.navigate).toHaveBeenCalledWith(['/admin/view-user']);
  // }));
});

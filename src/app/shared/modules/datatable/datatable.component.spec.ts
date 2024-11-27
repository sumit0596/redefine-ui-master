import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MatTestDialogOpenerModule } from '@angular/material/dialog/testing';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TestingModules } from 'src/app/testing/mocks';

import { DatatableComponent } from './datatable.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

fdescribe('DatatableComponent', () => {
  let component: DatatableComponent;
  let fixture: ComponentFixture<DatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DatatableComponent],
    imports: [MatTestDialogOpenerModule, MatTableModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(DatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  // fit(`download grid data`, fakeAsync(() => {
  //   component.rows=
  //     [{
  //       CellNumber: "Cape Town",
  //       Email: "alllls@gmail.com",
  //       FirstName :"John",
  //       LastName : "Kets",
  //       RoleName : "Admin",
  //       UserId: 21
  //     }]
     
  //   fixture.componentInstance.download();
  //   fixture.detectChanges;
  //   expect(component.rows.length).toBe(1);
  //   flush();
  // }));
});

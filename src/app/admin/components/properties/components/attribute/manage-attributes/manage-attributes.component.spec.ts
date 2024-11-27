import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { DatatableComponent } from 'src/app/shared/modules/datatable/datatable.component';
import { AttributeService } from '../../../../../services/attribute.service';
import { ManageAttributesComponent } from './manage-attributes.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export class MatDialogMock {
  open() {
   return {
     afterClosed: () => of(true)
   };
 }
}

fdescribe('AttributesComponent', () => {
  let component: ManageAttributesComponent;
  let fixture: ComponentFixture<ManageAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ManageAttributesComponent, DatatableComponent],
    imports: [ToastrModule.forRoot(), MatTableModule, RouterTestingModule],
    providers: [{ provide: MatDialog, useValue: {} },
        {
            provide: MatDialog, useClass: MatDialogMock,
        },
        {
            provide: MatDialogRef,
            useValue: { close: () => { } }
        },
        { provide: MAT_DIALOG_DATA, useValue: {} }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(ManageAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit(`should fetch  attributes`, fakeAsync(() => {
    let attributeServiceSpy = fixture.debugElement.injector.get(AttributeService);
    const resp ={
      status: "success",
      data: {
          FullAccess: 1,
          totalCount: 2,
          pageNumber: 1,
          pageCount: 10,
          attributes: [
              {
                  "AttributeId": 1,
                  "Title": "Johnii48448",
                  "AdditionalInformation": "Johnii48448",
                  "CreatedOn": "2023-03-17 03:05:58",
                  "AddedBy": "Humanyu Malik"
              },
              {
                  "AttributeId": 2,
                  "Title": "Test",
                  "AdditionalInformation": "Test",
                  "CreatedOn": "2023-03-17 03:06:05",
                  "AddedBy": "Humanyu Malik"
              }
          ]
      },
      message: "Data fetch from database"
  }
      
 let args = {
  pageNumber:1, pageSize:10
 }
    const getStatusResponse = new Observable<any>(observer => {
      observer.next(resp);
    });
    spyOn(attributeServiceSpy, 'getAllAttributes').withArgs(10,1)
      .and.returnValue((getStatusResponse));
    fixture.componentInstance.getAllAttributes(args);
    fixture.detectChanges;
    expect(component.totalRowsCount).toBe(resp.data.totalCount);
  }));
});

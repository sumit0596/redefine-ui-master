import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { DatatableComponent } from 'src/app/shared/modules/datatable/datatable.component';
import { PropertyService } from '../../../../services/property.service';
import { ManagePropertiesComponent } from './manage-properties.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export class MatDialogMock {
  open() {
   return {
     afterClosed: () => of(true)
   };
 }
}

fdescribe('PropertiesComponent', () => {
  let component: ManagePropertiesComponent;
  let fixture: ComponentFixture<ManagePropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ManagePropertiesComponent, DatatableComponent],
    imports: [ToastrModule.forRoot(), MatTableModule],
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

    fixture = TestBed.createComponent(ManagePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit(`should fetch  Properties`, fakeAsync(() => {
    let propertyServiceSpy = fixture.debugElement.injector.get(PropertyService);
    const resp ={
      "status": "success",
      "data": {
          "FullAccess": 1,
          "totalProperty": 4,
          "pageNumber": 1,
          "pageCount": 10,
          "properties": [
              {
                  "PropertyStatus": "Draft",
                  "UnitCount": 0,
                  "ImageCount": 0,
                  "VideoCount": 0,
                  "BrochureCount": 0,
                  "PropertyId": 4,
                  "PropertyName": "A test",
                  "Address": "Cape town",
                  "BuildingCode": "A Test",
                  "SectorName": "Retail"
            }]}
          }
      
 let args = {
  pageNumber:1, pageSize:10
 }
    const getStatusResponse = new Observable<any>(observer => {
      observer.next(resp);
    });
    spyOn(propertyServiceSpy, 'getAllProperties').withArgs(args.pageSize,args.pageNumber)
      .and.returnValue((getStatusResponse));
    fixture.componentInstance.getAllProperties(args);
    fixture.detectChanges;
    expect(component.totalRowsCount).toBe(resp.data.totalProperty);
  }));

  //need to write test case for getSectors

});

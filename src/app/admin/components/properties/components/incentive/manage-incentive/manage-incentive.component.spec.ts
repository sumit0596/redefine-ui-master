import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { DatatableComponent } from 'src/app/shared/modules/datatable/datatable.component';
import { IncentiveService } from '../../../../../services/incentive.service';
import { ManageIncentiveComponent } from './manage-incentive.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export class MatDialogMock {
  open() {
   return {
     afterClosed: () => of(true)
   };
 }
}

fdescribe('IncentivesComponent', () => {
  let component: ManageIncentiveComponent;
  let fixture: ComponentFixture<ManageIncentiveComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ManageIncentiveComponent, DatatableComponent],
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

    fixture = TestBed.createComponent(ManageIncentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit(`should fetch  incentives`, fakeAsync(() => {
    let incentiveServiceSpy = fixture.debugElement.injector.get(IncentiveService);
    const resp ={
      status: "success",
      data: {
          FullAccess: 1,
          totalCount: 1,
          pageNumber: 1,
          pageCount: 10,
          incentives: [
              {
                  "IncentiveId": 1,
                  "Title": "Test test 2",
                  "AdditionalInformation": "thisis test",
                  "Brochure": "http://34.100.196.155/redefine/public/storage/Brochure-1679049998-sample.pdf",
                  "TermAndCondition": "http://34.100.196.155/redefine/public/storage/TermAndCondition-1679049998-sample.pdf",
                  "BrochureName": "sample.pdf",
                  "TermAndConditionName": "sample.pdf",
                  "CreatedOn": "2023-03-17 10:46:38",
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
    spyOn(incentiveServiceSpy, 'getAllIncentives').withArgs(10,1)
      .and.returnValue((getStatusResponse));
    fixture.componentInstance.getAllIncentives(args);
    fixture.detectChanges;
    expect(component.totalRowsCount).toBe(resp.data.totalCount);
  }));
});

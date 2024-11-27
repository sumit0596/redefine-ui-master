import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PropertyEqService } from 'src/app/admin/services/property-eq.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-property-eq-preview',
  templateUrl: './property-eq-preview.component.html',
  styleUrls: ['./property-eq-preview.component.scss'],
})
export class PropertyEqPreviewComponent {
  propertyEqDetails: any;
  file: any = {};
  id: any;

  constructor(
    public dialogRef: MatDialogRef<PropertyEqPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private propertyEqService: PropertyEqService,
    private loaderService: LoaderService,
    private toasterService: ToastrService
  ) {}

  close() {
    this.dialogRef.close();
  }
  
}

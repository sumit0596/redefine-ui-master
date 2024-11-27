import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PropertyService } from 'src/app/admin/services/property.service';
import { EditorComponent } from '../form-elements/editor/editor.component';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-email-dialog',
  standalone: true,
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditorComponent,
    MatDividerModule,
    SharedModule,
  ],
})
export class EmailDialogComponent {
  mailForm!: any;
  errorMessage!: string;
  vacancyData: any;
  formConfig: any;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EmailDialogComponent>
  ) {}

  ngOnInit() {
    this.mailForm = this.fb.group({
      Message: [''],
      Id: this.data.Id,
      Type: this.data.Type, // Type = 1 for lead, 2 for enquiry
      Subject: [''],
    });
    this.bindSubject();
  }

  bindSubject() {
    let subject = '';
    if (this.data.Type == 1) {
      subject =
        'Your enquiry with Redefine Properties' +
        '(' +
        this.data.BuildingName +
        ')';
      this.mailForm.get('Subject').setValue(subject);
    } else {
      subject =
        'Your enquiry with Redefine Properties' +
        '(' +
        this.data.EnquiryType +
        ')';
      this.mailForm.get('Subject').setValue(subject);
    }
  }

  sendMessage() {
    let payload = this.mailForm.value;
    if (payload.Message != '') {
      this.propertyService.sendMessage(payload).subscribe({
        next: (res: any) => {
          this.toasterService.success(res.message);
          this.dialogRef.close('send');
        },
        error: (error: any) => {
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
    } else {
      this.dialogRef.close();
    }
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }

  closeModal() {
    this.mailForm.reset();
    this.dialogRef.close();
  }
}

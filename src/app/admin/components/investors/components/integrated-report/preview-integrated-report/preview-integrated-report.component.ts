import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-integrated-report',
  templateUrl: './preview-integrated-report.component.html',
  styleUrls: ['./preview-integrated-report.component.scss'],
})
export class PreviewIntegratedReportComponent {
  constructor(
    public dialogRef: MatDialogRef<PreviewIntegratedReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  close() {
    this.dialogRef.close();
  }
}

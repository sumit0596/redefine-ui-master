import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-customdialog',
  standalone: true,
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss'],
  imports: [CommonModule, SharedModule],
})
export class CustomDialogComponent {
  dialogData: any;
  constructor(
    public dialogRef: MatDialogRef<CustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogData = data;
  }
  /** Intimating to the listeners `primaryButton()` method. */
  onClickButton(status: any): void {
    this.dialogRef.close(status);
  }
}

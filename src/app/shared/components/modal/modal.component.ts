import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
export interface ModalData {
  message: string;
  title?: string;
  description?: string;
  acceptBtnLabel?: string;
  rejectBtnLabel?: string;
}
@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [CommonModule, SharedModule],
})
export class ModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ModalData
  ) {}
  close() {
    this.dialogRef.close();
  }
  submit(accept: boolean) {
    this.dialogRef.close(accept);
  }
}

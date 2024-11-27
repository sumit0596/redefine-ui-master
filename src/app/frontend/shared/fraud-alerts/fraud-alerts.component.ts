import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fraud-alerts',
  templateUrl: './fraud-alerts.component.html',
  styleUrls: ['./fraud-alerts.component.scss'],
})
export class FraudAlertsComponent {
  constructor(public dialogRef: MatDialogRef<FraudAlertsComponent>) {}

  closeModal() {
    this.dialogRef.close();
  }
}

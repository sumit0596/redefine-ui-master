import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-unit-availability-dialog',
  templateUrl: './unit-availability-dialog.component.html',
  styleUrls: ['./unit-availability-dialog.component.scss'],
})
export class UnitAvailabilityDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UnitAvailabilityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  close() {
    this.dialogRef.close();
  }

  No() {
    this.dialogRef.close('No');
  }
  Yes() {
 
    switch(this.data.rowId) { 
      case 'Available':
        this.dialogRef.close('Available');
        break;  
      case 'Unavailable':
        this.dialogRef.close('Unavailable');
        break;
      case 'Under Offer':
        this.dialogRef.close('Under Offer');
        break;
      case 'Under Negotiation':
        this.dialogRef.close('Under Negotiation');
        break;
      case 'Let':
        this.dialogRef.close('Let');
        break;
      default:
        this.dialogRef.close('Yes');
        return;
    }
  }
}

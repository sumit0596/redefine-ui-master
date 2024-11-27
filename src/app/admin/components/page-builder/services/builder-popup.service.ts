import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BuilderPopupComponent } from '../components/builder-popup/builder-popup.component';

@Injectable({
  providedIn: 'root',
})
export class BuilderPopupService {
  constructor(private dialog: MatDialog) {}
  openModal(config: any): MatDialogRef<any> {
    return this.dialog.open(BuilderPopupComponent, config);
  }
}

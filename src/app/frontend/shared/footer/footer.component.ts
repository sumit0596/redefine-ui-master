import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { VacancyScheduleContentComponent } from 'src/app/admin/components/properties/components/property/components/vacancy-schedule-content/vacancy-schedule-content.component';
import { AdAzureService } from 'src/app/services/adazure.service';
import { FraudAlertsComponent } from '../fraud-alerts/fraud-alerts.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class FooterComponent {
  constructor(
    private adAzureService: AdAzureService,
    public dialog: MatDialog
  ) {}

  adLogin() {
    this.adAzureService.adLogin();
  }

  openFraundAlerts() {
    const dialogRef = this.dialog.open(FraudAlertsComponent, {});
    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}

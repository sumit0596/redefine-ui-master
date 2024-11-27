import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FrontendService } from '../../services/frontend.service';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ROUTE } from 'src/app/models/constants';
import { MatDialog } from '@angular/material/dialog';
import { DripDialogComponent } from '../../modules/investors/drip-dialog/drip-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

export interface TabHead {
  label: string;
  content: string;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatTabsModule],
})
export class TabsComponent implements OnInit {
  // asyncTabs: Observable<TabHead[]>;
  sensList: any[] = [];
  newsList: any[] = [];
  eventsList: any[] = [];
  constructor(
    private frontendService: FrontendService,
    private commonStoreService: CommonStoreService,
    private cookieService: CookieService,
    private router: Router,
    private dialog: MatDialog
  ) {
    // this.asyncTabs = new Observable((observer: Observer<TabHead[]>) => {
    //   setTimeout(() => {
    //     observer.next([
    //       {label: 'First', content: 'Content 1'},
    //       {label: 'Second', content: 'Content 2'},
    //       {label: 'Third', content: 'Content 3'},
    //     ]);
    //   }, 1000);
    // });
  }
  ngOnInit(): void {
    this.getSensAnnouncements();
    // this.getEventsAnnouncements();
    this.getNewsAnnouncements();
  }
  getSensAnnouncements(): void {
    this.frontendService.getSensAnnouncements().subscribe({
      next: (result: any) => {
        // Get the latest 4 entries
        this.sensList = result.slice(0, 3);
      },
      error: (error: any) => {},
    });
  }

  sensDetailsPage(sens: any) {
    let formConfig = {
      id: sens.Slug,
    };
    this.commonStoreService.setFormConfig(formConfig);
    if (
      (this.cookieService.get('DRIP_FILTER') == 'Success' &&
        sens.Drip == 'Yes') ||
      sens.Drip == 'No'
    ) {
      this.router.navigate([ROUTE.SENS_DETAILS + sens.Slug]);
    } else if (this.cookieService.get('DRIP_FILTER') == '') {
      let data = {
        sens: sens,
        page: 'sens-announcement',
      };
      const dialogRef = this.dialog.open(DripDialogComponent, {
        data: data,
      });
      dialogRef.afterClosed().subscribe((result: any) => {});
    }
  }

  pressDetailsPage(press: any) {
    let formConfig = {
      id: press.Slug,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate(['/press-office/' + press.Slug]);
  }

  getNewsAnnouncements(): void {
    this.frontendService.getNewsAnnouncements().subscribe({
      next: (result: any) => {
        // Get the latest 4 entries
        this.newsList = result.slice(0, 3);
      },
      error: (error: any) => {},
    });
  }
}

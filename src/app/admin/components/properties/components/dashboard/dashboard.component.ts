import { Component, OnInit } from '@angular/core';
import { DASHBOARD_TITLE, SESSION } from 'src/app/models/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  menuId: any;
  menuList: any[] = [];
  portalMenu!: any;
  ngOnInit(): void {
    this.menuId = localStorage.getItem(SESSION.MENU_ID);
    this.menuList = JSON.parse(
      sessionStorage.getItem(SESSION.USER_MENU) || '[]'
    );
    this.portalMenu = this.menuList.find(
      (menu: any) => menu.AdminMenuId == this.menuId
    );
  }

  getFeatureIcon(name: string): string {
    switch (name) {
      case DASHBOARD_TITLE.All_PROPERTIES:
        return 'south-african-properties.svg';
      case DASHBOARD_TITLE.INTERNATIONAL_PROPERTIES:
        return 'international-properties.svg';
      case DASHBOARD_TITLE.ATTRIBUTES:
        return 'property-attributes.svg';
      case DASHBOARD_TITLE.INCENTIVES:
        return 'property-incentives.svg';
        case DASHBOARD_TITLE.Leads:
        return 'Lead.svg';

      default:
        return '';
    }
  }
}

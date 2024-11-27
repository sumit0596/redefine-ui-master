import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DASHBOARD_TITLE, SESSION } from 'src/app/models/constants';

@Component({
  selector: 'app-portal',
  standalone: true,
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class PortalComponent implements OnInit {
  slug: any;
  menuList: any[] = [];
  @Input() name: string | undefined;
  portalMenu$!: Observable<any>;
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.slug = this.router.url.split('/').at(-1);
    // this.menuId = localStorage.getItem(SESSION.MENU_ID);
    this.menuList = JSON.parse(
      sessionStorage.getItem(SESSION.USER_MENU) || '[]'
    );
    this.portalMenu$ = of(
      this.menuList.find((menu: any) => menu.Url == this.slug)
    );
  }
  getFeatureIcon(name: string): string {
    switch (name) {
      case DASHBOARD_TITLE.FINANCIAL_RESULTS:
        return 'financial-results.svg';
      case DASHBOARD_TITLE.INTEGRATED_REPORTING:
        return 'integrated-reporting.svg';
      case DASHBOARD_TITLE.CIRCULARS:
        return 'circulars.svg';
      case DASHBOARD_TITLE.SENS:
        return 'sens.svg';
      case DASHBOARD_TITLE.PRESENTATIONS:
        return 'presentation.svg';
      case DASHBOARD_TITLE.DEBT_PROGRAMME:
        return 'debt-programme.svg';
      case DASHBOARD_TITLE.EVENTS:
        return 'events.svg';
      case DASHBOARD_TITLE.All_PROPERTIES:
        return 'all-properties.svg';
      case DASHBOARD_TITLE.ATTRIBUTES:
        return 'events.svg';
      case DASHBOARD_TITLE.EVENTS:
        return 'events.svg';
      case DASHBOARD_TITLE.PRESS_OFFICE:
        return 'press-office.svg';
      case DASHBOARD_TITLE.INVESTOR_CONTACTS:
        return 'investor-contacts.svg';
      case DASHBOARD_TITLE.ESG_CONTACTS:
        return 'esg-contacts.svg';
      case DASHBOARD_TITLE.CUSTOM_PAGES:
        return 'integrated-reporting.svg';
      case DASHBOARD_TITLE.INTERNATIONAL_PROPERTIES:
        return 'international-properties.svg';
      case DASHBOARD_TITLE.INCENTIVES:
        return 'integrated-reporting.svg';
      case DASHBOARD_TITLE.GENERIC:
        return 'generic.svg';
      case DASHBOARD_TITLE.ESG:
        return 'generic.svg';
      case DASHBOARD_TITLE.TAGS:
        return 'Tag.svg';
      default:
        return 'integrated-reporting.svg';
    }
  }
}

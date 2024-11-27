import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DebtProgrammeService } from 'src/app/admin/services/debt-programme.service';
import { CareerService } from 'src/app/frontend/services/career.service';
import { DEBT_PROGRAMME_CATEGORIES } from 'src/app/models/enum';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANTS } from 'src/app/models/constants';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-debt-programme',
  templateUrl: './debt-programme.component.html',
  styleUrls: ['./debt-programme.component.scss'],
})
export class DebtProgrammeComponent {
  bannerDetails: any;
  quickLinks: any;
  bannerText = 'Debt programme and credit ratings ';
  tabName: any;
  tab = 0;
  Type = 1;
  debtProgramme: any;
  otherDebts: any;
  debtsOfficer: any;
  debtsDisclosures: any;
  debtCategories = [
    { Id: 1, Name: DEBT_PROGRAMME_CATEGORIES.DEBT_PROGRAMME_OTHER },
    { Id: 2, Name: DEBT_PROGRAMME_CATEGORIES.DEBT_PROGRAMME_DEBT_OFFICER },
    { Id: 3, Name: DEBT_PROGRAMME_CATEGORIES.DEBT_PROGRAMME_DISCLOSURES },
  ];

  constructor(
    private careerService: CareerService,
    private debtService: DebtProgrammeService,
    private toasterService: ToastrService,
    private _location: Location,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router
  ) {
    // if(this.router.url.includes('credit-ratings')){
    //     this.tab =2;
    // }
    this.route.paramMap.subscribe((params) => {
      if (params.get(CONSTANTS.ROUTE_ID)) {
        if (params.get(CONSTANTS.ROUTE_ID) == 'pricing-supplement') {
          this.tab = 1;
          this.Type = 2;
        } else {
          this.tab = 2;
          this.Type = 3;
        }
      }
	  this.getAllDebtProgramme();
    });
  }

  ngOnInit() {
    this.getBanner();
    this.quicklinks();
    
  }

  getBanner() {
    this.careerService
      .getBanner('DEBT_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  quicklinks() {
    this.debtService
      .getQuickLinks()
      .subscribe((res: any) => (this.quickLinks = res.data));
  }

  getAllDebtProgramme() {
    this.debtService.getAllDebtProgrammesFrontend(this.Type).subscribe({
      next: (res: any) => {
        this.debtProgramme = res.data.debtcreditratings;
        this.debtData();
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
      complete: () => {},
    });
  }

  onTabChange(event: any) {
    this.tabName = event.tab.textLabel;
    if (event.tab.textLabel == 'DebtProgramme') {
      this.Type = 1;
      this.router.navigate(['/investors/investor-information/debt-programme']);
      // this._location.go('investors/investor-information/' + 'debt-programme');
    } else if (event.tab.textLabel == 'PricingSupplement') {
      this.Type = 2;
      this.router.navigate([
        '/investors/investor-information/debt-programme/pricing-supplement',
      ]);
      // this._location.go(
      //   'investors/investor-information/' + 'debt-programme/pricing-supplement'
      // );
    } else if (event.tab.textLabel == 'CreditRatings') {
      this.Type = 3;
      // this._location.go(
      //   'investors/investor-information/' + 'debt-programme/credit-ratings'
      // );
      this.router.navigate([
        '/investors/investor-information/debt-programme/credit-ratings',
      ]);
    }
   // this.getAllDebtProgramme();
  }

  debtData() {
    if (this.Type == 1) {
      this.otherDebts = this.debtProgramme.filter(
        (x: any) =>
          x.DebtCreditCategoryName ===
          DEBT_PROGRAMME_CATEGORIES.DEBT_PROGRAMME_OTHER
      );
      this.debtsOfficer = this.debtProgramme.filter(
        (x: any) =>
          x.DebtCreditCategoryName ===
          DEBT_PROGRAMME_CATEGORIES.DEBT_PROGRAMME_DEBT_OFFICER
      );
      this.debtsDisclosures = this.debtProgramme.filter(
        (x: any) =>
          x.DebtCreditCategoryName ===
          DEBT_PROGRAMME_CATEGORIES.DEBT_PROGRAMME_DISCLOSURES
      );
    }
  }

  download(event: MouseEvent, url: string) {
    event.preventDefault();
    this.commonService.pdfDownload(url);
  }
}

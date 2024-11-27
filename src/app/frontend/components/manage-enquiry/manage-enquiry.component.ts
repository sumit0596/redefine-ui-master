import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FePropertiesService } from 'src/app/admin/services/fe-properties.service';
import { CONSTANTS, ROUTE } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { SliderComponent } from 'src/app/shared/components/form-elements/slider/slider.component';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-manage-enquiry',
  standalone: true,
  templateUrl: './manage-enquiry.component.html',
  styleUrls: ['./manage-enquiry.component.scss'],
  imports: [CommonModule, BreadcrumbsComponent, SliderComponent, SharedModule],
  providers: [DecimalPipe],
})
export class ManageEnquiryComponent implements OnInit {
  slug!: any;
  propertyUnits!: any;
  filter = {
    SizeStart: 0,
    SizeEnd: 6000,
    GrossRentalStart: 0,
    GrossRentalEnd: 6000,
  };
  selectedUnits: any = [];
  propertyId: any;
  propertyName: any;
  propertyDetails: any;
  maxGrossRental: any;
  maxUnitSize: any;
  urlData: any;
  formConfig: any;
  minGrossRental: any;
  minUnitSize: any;

  constructor(
    private feproperties: FePropertiesService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private commonStoreService: CommonStoreService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get(CONSTANTS.ROUTE_ID);
    });
  }
  async ngOnInit() {
    this.getSizeGrossRentalMax();
    this.getProperties();
    this.formConfig = await this.commonStoreService.getFormConfig();
    this.urlData = {
      url: this.slug,
      replacedUrl: this.formConfig.propertyDetails.PropertyName,
    };
  }

  getSizeGrossRentalMax() {
    this.feproperties.getGrossRentalMax(2).subscribe((res) => {
      if (res.MaxGrossRental != undefined) {
        this.maxGrossRental = res.MaxGrossRental;
        this.minGrossRental = res.MINGrossRental;
        this.filter.GrossRentalStart = parseInt(
          res?.MINGrossRental?.replace(/,/g, '')
        );
        this.filter.GrossRentalEnd = parseInt(
          res?.MaxGrossRental?.replace(/,/g, '')
        );
      }
      if (res.MaxUnitSize != undefined) {
        this.maxUnitSize = res.MaxUnitSize;
        this.minUnitSize = res.MINUnitSize;
        this.filter.SizeStart = res.MINUnitSize;
        this.filter.SizeEnd = res?.MaxUnitSize;
      }
    });
  }

  getProperties() {
    this.loaderService.show();
    this.feproperties.getPropertyUnitFE(this.slug).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        if (res.length == 0) {
          this.NavigateToEnquiryForm();
        } else {
          this.propertyUnits = res;
        }
      },
      error: (error: any) => {
        this.loaderService.hide();
      },
    });
  }

  getFilteredProperties() {
    this.loaderService.show();
    this.feproperties.getPropertyUnitFE(this.slug, this.filter).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        if (res.length == 0) {
          this.NavigateToEnquiryForm();
        } else {
          this.propertyUnits = res;
        }
      },
      error: (error: any) => {
        this.loaderService.hide();
      },
    });
  }

  navigateToUnit() {
    this.router.navigate([ROUTE.NEED_SPACE, this.slug]);
    this.feproperties.setDefaultTab(1);
  }

  NavigateToEnquiryForm() {
    // let data : any= {};
    // data['selectedUnits'] = this.selectedUnits;
    // data['propertyDetails'] = this.propertyDetails;
    let formConfig = {
      selectedUnits: this.selectedUnits,
      propertyDetails: this.formConfig?.propertyDetails,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate(['user-details'], { relativeTo: this.route });
  }

  unitSelected(unit: any, event: any) {
    if (event.target.checked) {
      this.selectedUnits.push(unit);
    } else {
      for (let i = 0; i < this.selectedUnits.length; i++) {
        if (this.selectedUnits[i].PropertyUnitId == unit.PropertyUnitId) {
          this.selectedUnits.splice(i, 1);
        }
      }
    }
  }

  onSizeChange(event: any) {
    this.filter = {
      ...this.filter,
      SizeStart: event.event.value,
      SizeEnd: event.event.highValue,
    };
    this.getFilteredProperties();
  }

  onSliderChange(event: any, type: string) {
    this.updateFilter(event, type);
  }

  updateFilter(data: any, type: any) {
    this.filter = { ...this.filter };
    switch (type) {
      case 'Size':
        this.filter = {
          ...this.filter,
          SizeStart: data.event.value,
          SizeEnd: data.event.highValue,
        };
        break;
      case 'GrossRental':
        this.filter = {
          ...this.filter,
          GrossRentalStart: data.event.value,
          GrossRentalEnd: data.event.highValue,
        };
        break;

      default:
        break;
    }
    this.getFilteredProperties();
  }
  clearFilter() {
    this.filter.SizeEnd = this.maxUnitSize;
    this.filter.SizeStart = this.minUnitSize;
    this.filter.GrossRentalStart = this.minGrossRental;
    this.filter.GrossRentalEnd = this.maxGrossRental;
    this.getProperties();
  }
}

import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { AfterViewInit, Component } from '@angular/core';
import { StepperService } from '../../../../../../services/stepper.service';
import { PropertyService } from 'src/app/admin/services/property.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PropertyComponent } from '../../property.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { ROUTE } from 'src/app/models/constants';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-property-contact-details-form',
  templateUrl: './property-contact-details-form.component.html',
  styleUrls: [
    './property-contact-details-form.component.scss',
    '../../property.component.scss',
  ],
})
export class PropertyContactDetailsFormComponent
  extends PropertyComponent
  implements AfterViewInit
{
  selectedBrokerLiasion: any;
  constructor(
    router: Router,
    fb: FormBuilder,
    loaderService: LoaderService,
    stepperService: StepperService,
    propertyService: PropertyService,
    commonStoreService: CommonStoreService,
    toasterService: ToastrService,
    dialog: MatDialog,
    commonService: CommonService
  ) {
    super(
      fb,
      loaderService,
      stepperService,
      propertyService,
      commonStoreService,
      router,
      toasterService,
      dialog,
      commonService
    );
    this.stepperService.setStep({ label: 'Step 3', active: true });
  }

  override ngOnDestroy(): void {}
  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.propertyContactDetailsForm.valid) {
      let payload = this.createPayload();
      this.saveContactDetails(payload);
    }
  }

  saveContactDetails(payload: any) {
    this.loaderService.show();
    this.propertyService
      .addPropertyContactDetails(this.propertyId, payload)
      .subscribe({
        next: (res) => {
          this.loaderService.hide();
          //this.toasterService.success(res.message);
          this.changeStep(ROUTE.PROPERTY_FEATURES, res.message);
        },
        complete: () => {},
        error: (error) => {
          this.loaderService.hide();
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
  }
  createPayload() {
    let payload = this.propertyContactDetailsForm.value;
    return payload;
  }

  validateForm() {
    Object.keys(this.propertyContactDetailsForm.controls).forEach(
      (control: any) => {
        this.setControlError(control);
      }
    );
  }

  checkError(control: string, error: string) {
    return this.propertyContactDetailsForm.get(control)?.hasError(error);
  }

  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.propertyContactDetailsForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    }
  }
}

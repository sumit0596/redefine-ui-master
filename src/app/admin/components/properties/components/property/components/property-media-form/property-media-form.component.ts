import { CommonStoreService } from 'src/app/services/common-store.service';
import { PropertyAdvertisingFormComponent } from './../property-advertising-form/property-advertising-form.component';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StepperService } from '../../../../../../services/stepper.service';
import { PropertyService } from 'src/app/admin/services/property.service';
import { IMedia } from 'src/app/interfaces/media';
import { ToastrService } from 'ngx-toastr';
import { HttpEventType } from '@angular/common/http';
import { PropertyComponent } from '../../property.component';
import { Router } from '@angular/router';
import { CONSTANTS, ROUTE } from 'src/app/models/constants';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-property-media-form',
  templateUrl: './property-media-form.component.html',
  styleUrls: [
    './property-media-form.component.scss',
    '../../property.component.scss',
  ],
})
export class PropertyMediaFormComponent extends PropertyComponent {
  mediaType!: string;

  brochureFile: boolean = false;
  rateCardFile: boolean = false;
  videoFile: boolean = false;
  floorPlanFile: boolean = false;

  videos!: any[];
  images!: any[];
  fileList!: any[];
  brochures!: any[];
  rateCards!: any[];
  floorPlans!: any[];
  progressFiles!: any[];
  selectedFiles!: any[];
  imageLengtherrorMessage: string = '';
  mediaLength: any;

  MEDIA_CONSTANTS = {
    BROCHURE: 'Brochure',
    RATE_CARD: 'RateCard',
    VIDEO: 'Video',
    FLOOR_PLAN: 'FloorPlan',
    FACT_SHEET: 'FactSheet',
    MALL_MAP: 'MallMap',
  };
  propertyData: any;

  constructor(
    router: Router,
    fb: FormBuilder,
    dialog: MatDialog,
    loaderService: LoaderService,
    stepperService: StepperService,
    propertyService: PropertyService,
    commonStoreService: CommonStoreService,
    toasterService: ToastrService,
    private dialogRef: MatDialog,
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
    this.stepperService.setStep({ label: 'Step 2', active: true });
    this.formConfig = this.commonStoreService.getFormConfig();
    this.propertyService
      .getPropertyDetails()
      .subscribe((res) => (this.propertyData = res));
  }
  override ngOnDestroy(): void {}
  onFileSelect(fileList: any[], type: string) {
    
    this.mediaLength = this.propertyData?.media?.Image?.length;
    if (
      (this.mediaLength >= 10 ||
        fileList.length > 10 ||
        this.mediaLength + fileList.length > 10) &&
      type != 'FloorPlan' &&
      type != 'Video' &&
      type != 'Brochure' &&
      type != 'RateCard' &&
      type != 'MallMap' &&
      type != 'FactSheet'
    ) {
      this.imageLengtherrorMessage = 'Only 10 images are allowed';
    } else {
      this.imageLengtherrorMessage = '';
      this.progressFiles = [];
      this.mediaType = type;
      this.selectedFiles = [...fileList];
      this.uploadFiles();
    }
  }
  uploadFiles() {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.media = {
        File: this.selectedFiles[i],
        Type: this.mediaType,
      };
      
      // this.progressFiles[i] = { value: 0, file: this.selectedFiles[i] };
      this.upload(this.media, i);
    }
  }

  uploadMediaLink(event: any, type: string) {
    if (event.value) {
      this.media = {
        Link: event.value,
        Type: type,
      };
      this.mediaType = type;
      this.upload(this.media, 0);
    }
  }
  upload(payload: any, index: any) {
    this.loaderService.show();
    this.propertyService
      .uploadPropertyMedia(payload, this.propertyId)
      .subscribe({
        next: (event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              // if (this.progressFiles[index]) {
              // this.progressFiles[index].value = Math.round(
              //   (100 * event.loaded) / event.total
              // );
              // }
              break;
            case HttpEventType.Response:
              this.toasterService.success(event.body.message);
              this.propertyService
                .getPropertyDetailsById(
                  this.propertyDetails?.details?.PropertyId
                )
                .subscribe((result: any) => {
                  this.propertyData = result?.data;
                });
              // this.progressFiles[index] = null;
              this.updateForm(event.body.data);
              break;
          }
        },
        complete: () => {
          this.loaderService.hide();
          // this.progressFiles[index] = null;
        },
        error: (error) => {
          this.loaderService.hide();
          // this.progressFiles[index] = null;
          this.toasterService.error(
            `Could not upload the file ${payload.File.name}`
          );
        },
      });
  }
  onFileDelete(event: any) {
    this.fileList.slice(event, 1);
  }
  deletePropertyImage(fileInfo: any) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.imageLengtherrorMessage = '';
        this.loaderService.show();
        this.propertyService.deletePropertyMedia(fileInfo.Id).subscribe({
          next: (res) => {
            this.loaderService.hide();
            this.toasterService.success(res.message);
            const index = this.imageForms.controls.findIndex((control:any) => control.value.Id === fileInfo.Id);
            if (index !== -1) {
              this.imageForms.removeAt(index); // Remove the control if the value matches
            }
            this.propertyService
              .getPropertyDetailsById(this.propertyDetails?.details?.PropertyId)
              .subscribe((result: any) => {
                this.propertyData = result?.data;
              });
          },
          error: (error) => {
            this.loaderService.hide();
            error.error.errors
              ? this.displayError(error.error.errors)
              : this.toasterService.error(error.error.message);
          },
        });
      }
    });
  }
  getIndex(id: number): number {
    return [...this.imageForms.value].findIndex((image: any) => image.Id == id);
  }
  deletePdf(fileInfo: any, formType: string, toggleDelete: boolean = false) {
    if (!toggleDelete) {
      const dialogRef = this.commonService.deleteFileConfirmation();
      dialogRef.afterClosed().subscribe((action: any) => {
        if (action) {
          this.deletePdfFile(fileInfo, formType);
        }
      });
    } else {
      this.deletePdfFile(fileInfo, formType);
    }
  }

  deletePdfFile(fileInfo: any, formType: string) {
    this.loaderService.show();
    this.propertyService.deletePropertyMedia(fileInfo.Id).subscribe({
      next: (res) => {
        let form = this.getForm(formType);
        Object.keys(form.controls).forEach((control) => {
          form.get(control)?.setValue('');
        });
        this.propertyService
          .getPropertyDetailsById(this.propertyDetails?.details?.PropertyId)
          .subscribe((result: any) => {
            this.propertyData = result?.data;
          });
        this.loaderService.hide();
        this.toasterService.success(res.message);
      },
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  deleteAdvertisement(id: number) {
    this.loaderService.show();
    this.propertyService.deletePropertyAdvertisement(id).subscribe({
      next: (res) => {
        this.propertyDetails.advertisments =
          this.propertyDetails.advertisments.filter(
            (advertisement: any) => advertisement.PropertyAdvertisingId != id
          );
        this.loaderService.hide();
        this.toasterService.success(res.message);
      },
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  updateForm(data: any) {
    let mediaData: IMedia = {
      Id: data.PropertyMediaId,
      Name: data.Name,
      Url: data.Url,
      Type: this.mediaType,
      CreatedOn: data.CreatedOn,
    };
    switch (this.mediaType) {
      case 'Image':
        this.imageForms.push(this.createItem(mediaData));
        break;
      case 'Brochure':
        this.brochureForm.patchValue(mediaData);
        break;
      case 'RateCard':
        this.rateCardForm.patchValue(mediaData);
        break;
      case 'Video':
        this.videoForm.patchValue(mediaData);
        break;
      case 'FloorPlan':
        this.floorPlanForm.patchValue(mediaData);
        break;
      case 'FactSheet':
        this.factSheetForm.patchValue(mediaData);
        break;
      case 'MallMap':
        this.mallMapForm.patchValue(mediaData);
        break;
    }
  }
  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }
  toggleSwitch(event: any, type: string = '') {
    switch (event.label) {
      case 'Brochure':
        this.propertyMediaUpdates(event.checked, 'Brochure', this.brochureForm);
        break;
      case 'RateCard':
        this.propertyMediaUpdates(event.checked, 'RateCard', this.rateCardForm);
        break;
      case 'Video':
        this.propertyMediaUpdates(event.checked, 'Video', this.videoForm);
        break;
      case 'FloorPlan':
        this.propertyMediaUpdates(
          event.checked,
          'FloorPlan',
          this.floorPlanForm
        );
        break;
      case 'FactSheet':
        this.propertyMediaUpdates(
          event.checked,
          'FactSheet',
          this.factSheetForm
        );
        break;
      case 'MallMap':
        this.propertyMediaUpdates(event.checked, 'MallMap', this.mallMapForm);
        break;
    }
  }
  getForm(formType: string): any {
    switch (formType) {
      case 'Image':
        return this.imageForms;
      case 'Brochure':
        return this.brochureForm;
      case 'RateCard':
        return this.rateCardForm;
      case 'Video':
        return this.videoForm;
      case 'FloorPlan':
        return this.floorPlanForm;
      case 'FactSheet':
        return this.factSheetForm;
      case 'MallMap':
        return this.mallMapForm;
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(PropertyAdvertisingFormComponent);
    dialogRef.afterClosed().subscribe((result) => {});
  }
  onSubmit() {
    let payload = this.createPayload();
    if (this.propertyMediaForm.valid && payload) {
      this.uploadLinks(payload);
    }
  }
  createPayload() {
    let payload: { PropertyId: string; Links: any[] } = {
      PropertyId: this.formConfig.id,
      Links: [],
    };
    Object.keys(this.propertyMediaForm.controls).forEach((control: any) => {
      let formControl = this.propertyMediaForm.get(control);
      if (formControl instanceof FormGroup && !formControl.value.IsFile) {
        payload.Links.push({
          Url: formControl.value.Url,
          Type: this.getType(control),
        });
      }
    });
    return payload.Links.length ? payload : undefined;
  }

  getType(control: any): any {
    switch (control) {
      case 'Brochure':
        return 'Brochure';
      case 'Video':
        return 'Video';
      case 'RateCard':
        return 'RateCard';
      case 'FloorPlan':
        return 'FloorPlan';
      case 'FactSheet':
        return 'FactSheet';
      case 'MallMap':
        return 'MallMap';
    }
  }

  uploadLinks(payload: any) {
    this.loaderService.show();
    this.propertyService.uploadPropertyMediaLink(payload).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.changeStep(ROUTE.PROPERTY_CONTACT_DETAILS, res.message);
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  addAdvertisement() {
    const advertisingFormDialog = this.dialogRef.open(
      PropertyAdvertisingFormComponent,
      {
        data: {
          mode: 'create',
        },
        disableClose: true,
      }
    );
    advertisingFormDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        let payload = this.createAdvertisingPayload(result);
        this.addAdvertisingOpportunities(payload);
      }
    });
  }
  editAdvertisement(advertisement: any) {
    const advertisingFormDialog = this.dialogRef.open(
      PropertyAdvertisingFormComponent,
      {
        data: {
          mode: 'edit',
          advertisingDetails: {
            PropertyAdvertisingId: advertisement.PropertyAdvertisingId,
            AdvertisingTypeId: advertisement.AdvertisingTypeId,
            DescriptionAndLocation: advertisement.DescriptionAndLocation,
            RateCard: advertisement.File,
          },
        },
        disableClose: true,
      }
    );
    advertisingFormDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        let payload = this.createAdvertisingPayload(result);
        this.UpdateAdvertising(payload, advertisement.PropertyAdvertisingId);
      }
    });
  }
  createAdvertisingPayload(result: any) {
    return Object.assign(result, { PropertyId: this.propertyId });
  }
  addAdvertisingOpportunities(payload: any) {
    this.loaderService.show();
    this.propertyService.addAdvertisingOpportunities(payload).subscribe({
      next: (res) => {
        this.loaderService.hide();
        this.getPropertyDetails();
      },
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  UpdateAdvertising(payload: any, id: number) {
    this.loaderService.show();
    this.propertyService.updateAdvertisingOpportunities(payload, id).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.getPropertyDetails();
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  onImageReorder(event: any) {
    this.loaderService.show();
    let payload = this.createImageReorderPayload(event);
    this.loaderService.show();
    this.propertyService.reorderPropertyImages(payload).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  createImageReorderPayload(fileList: any[]) {
    let payload: { PropertyId: string; Media: any[] } = {
      PropertyId: this.formConfig.id,
      Media: [],
    };
    payload.Media = fileList.map((file: any, index: number) => {
      return { Position: index + 1, PropertyMediaId: file.Id };
    });

    return payload;
  }

  setToggle(data: string) {
    return { checked: data === 'Yes' ? true : false };
  }

  propertyMediaUpdates(checked: boolean, type: string, form: FormGroup) {
    if (checked == false) {
      if (
        this.propertyData?.media?.[type] &&
        this.propertyData?.media?.[type]?.IsFile == 1
      ) {
        form.get('IsFile')?.setValue(checked);
        form.get('Url')?.setValue('');
        this.deletePdf(this.propertyData?.media?.[type], type, true);
      } else {
        form.get('IsFile')?.setValue(checked);
        form.get('Url')?.setValue('');
      }
    } else {
      form.get('IsFile')?.setValue(checked);
      form.get('Url')?.setValue('');
    }
  }
}

// if(!checked){
//   if(this.propertyData?.media?.[type] && this.propertyData?.media?.[type]?.IsFile == 1){
//     const dialogRef = this.commonService.dialog(
//       CONSTANTS.FILE_DELETE_CONFIRMATION,
//       CONSTANTS.NO,
//       CONSTANTS.YES
//     );
//     dialogRef.afterClosed().subscribe((action: any) => {
//       if (action === CONSTANTS.YES) {
//         form.get('IsFile')?.setValue(checked);
//         form.get('Url')?.setValue('');
//         this.deletePdf(this.propertyData?.media?.[type], type);
//       }
//       else{
//         form.get('IsFile')?.setValue(true);
//       }
//     });
//   }
//   else{
//     form.get('IsFile')?.setValue(checked);
//     form.get('Url')?.setValue('');
//   }
// }
// else{
//   form.get('IsFile')?.setValue(checked);
// }
// }
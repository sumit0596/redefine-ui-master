import { HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PropertyService } from 'src/app/admin/services/property.service';
import { StepperService } from 'src/app/admin/services/stepper.service';
import { IMedia } from 'src/app/interfaces/media';
import { CONSTANTS, ROUTE } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { InternationalPropertyComponent } from '../../international-property.component';

@Component({
  selector: 'app-international-property-media-form',
  templateUrl: './international-property-media-form.component.html',
  styleUrls: ['./international-property-media-form.component.scss'],
})
export class InternationalPropertyMediaFormComponent extends InternationalPropertyComponent {
  mediaType!: string;
  progressFiles!: any[];
  selectedFiles!: any[];
  fileList!: any[];
  propertyData: any;
  mediaLength: any;
  imageLengtherrorMessage!: string;

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
    this.propertyService
      .getInternationalPropertyDetails()
      .subscribe((res) => (this.propertyData = res));
  }

  onFileSelect(fileList: any[], type: string) {
    this.mediaLength = this.propertyData?.media?.Image?.length;
    if (
      (this.mediaLength >= 10 ||
        fileList.length > 10 ||
        this.mediaLength + fileList.length > 10) &&
      type != 'FloorPlan' &&
      type != 'Video'
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
      this.upload(this.media, i);
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
        this.loaderService.show();
        this.propertyService.deletePropertyMedia(fileInfo.Id).subscribe({
          next: (res) => {
            this.loaderService.hide();
            this.toasterService.success(res.message);
            this.imageForms.removeAt(this.getIndex(fileInfo.Id));
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
      // case 'Brochure':
      //   this.brochureForm.patchValue(mediaData);
      //   break;
      // case 'RateCard':
      //   this.rateCardForm.patchValue(mediaData);
      //   break;
      // case 'Video':
      //   this.videoForm.patchValue(mediaData);
      //   break;
      // case 'FloorPlan':
      //   this.floorPlanForm.patchValue(mediaData);
      //   break;
      // case 'MallMap':
      //   this.mallMapForm.patchValue(mediaData);
      //   break;
    }
  }
  createItem(data: any): FormGroup {
    return this.fb.group(data);
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

  onSubmit() {
    this.changeStep(ROUTE.CREATE_INTERNATIONAL_PROPERTY_FEATURES);
  }
}

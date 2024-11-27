import { HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UnitService } from 'src/app/admin/services/unit.service';
import { IMedia } from 'src/app/interfaces/media';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { StepperService } from '../../../../../../services/stepper.service';
import { UnitComponent } from '../../unit.component';
import { CONSTANTS, FORM_MODE, ROUTE } from 'src/app/models/constants';
import { PropertyService } from 'src/app/admin/services/property.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-unit-media-form',
  templateUrl: './unit-media-form.component.html',
  styleUrls: ['./unit-media-form.component.scss'],
})
export class UnitMediaFormComponent extends UnitComponent {
  mediaType!: string;
  videoFile: boolean = false;
  floorPlanFile: boolean = false;

  videos!: any[];
  images!: any[];
  fileList!: any[];
  floorPlans!: any[];
  progressFiles!: any[];
  selectedFiles!: any[];

  MEDIA_CONSTANTS = {
    VIDEO: 'Video',
    FLOOR_PLAN: 'FloorPlan',
  };
  propertyUnitId: any;
  mediaLength: any;
  imageLengtherrorMessage: string = '';
  unitData: any;

  constructor(
    router: Router,
    fb: FormBuilder,
    loaderService: LoaderService,
    stepperService: StepperService,
    unitService: UnitService,
    commonStoreService: CommonStoreService,
    private dialog: MatDialog,
    private dialogRef: MatDialog,
    propertyService: PropertyService,
    toasterService: ToastrService,
    commonService: CommonService
  ) {
    super(
      fb,
      loaderService,
      stepperService,
      unitService,
      commonStoreService,
      router,
      propertyService,
      toasterService,
      commonService
    );
    this.stepperService.setStep({ label: 'Step 2', active: true });
    this.formConfig = this.commonStoreService.getFormConfig();
    this.unitService.getUnitDetails().subscribe((res) => (this.unitData = res));
  }

  // override ngOnDestroy(): void {}
  onFileSelect(fileList: any[], type: string) {
    this.mediaLength = this.unitData?.media?.Image?.length;
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
      // this.progressFiles[i] = { value: 0, file: this.selectedFiles[i] };
      this.upload(this.media, i);
    }
  }

  onFileDelete(event: any) {
    this.fileList.slice(event, 1);
  }

  deleteUnitImage(fileInfo: any) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.imageLengtherrorMessage = '';
        this.loaderService.show();
        this.unitService.deleteUnitMedia(fileInfo.Id).subscribe({
          next: (res) => {
            this.loaderService.hide();
            this.toasterService.success(res.message);
           // this.imageForms.removeAt(this.getIndex(fileInfo.Id));
            this.imageForms.value.splice(this.getIndex(fileInfo.Id), 1);
            
            this.unitService
              .getUnitDetailsById(this.unitDetails?.details?.PropertyUnitId)
              .subscribe((result: any) => {
                this.unitData = result?.data;
              });
          },
          error: (error) => {
            this.loaderService.hide();
            this.toasterService.error(error.error.message);
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
    this.unitService.deleteUnitMedia(fileInfo.Id).subscribe({
      next: (res) => {
        let form = this.getForm(formType);
        Object.keys(form.controls).forEach((control) => {
          form.get(control)?.setValue('');
        });
        this.unitService
          .getUnitDetailsById(this.unitDetails?.details?.PropertyUnitId)
          .subscribe((result: any) => {
            this.unitData = result?.data;
          });
        this.loaderService.hide();
        this.toasterService.success(res.message);
      },
      error: (error) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
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
      case 'Video':
        this.videoForm.patchValue(mediaData);
        break;
      case 'FloorPlan':
        this.floorPlanForm.patchValue(mediaData);
        break;
    }
  }
  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }
  toggleSwitch(event: any, type: string = '') {
    switch (event.label) {
      case 'Video':
        //this.videoForm.get('IsFile')?.setValue(event.checked);
        this.unitMediaUpdates(event.checked, 'Video', this.videoForm);
        break;
      case 'FloorPlan':
        // this.floorPlanForm.get('IsFile')?.setValue(event.checked);
        this.unitMediaUpdates(event.checked, 'FloorPlan', this.floorPlanForm);
        break;
    }
  }
  getForm(formType: string): any {
    switch (formType) {
      case 'Image':
        return this.imageForms;
      case 'Video':
        return this.videoForm;
      case 'FloorPlan':
        return this.floorPlanForm;
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
    this.unitService
      .uploadUnitMedia(payload, this.propertyId, this.PropertyUnitId)
      .subscribe({
        next: (event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              break;
            case HttpEventType.Response:
              this.toasterService.success(event.body.message);
              this.unitService
                .getUnitDetailsById(this.unitDetails?.details?.PropertyUnitId)
                .subscribe((result: any) => {
                  this.unitData = result?.data;
                });
              this.updateForm(event.body.data);
              break;
          }
        },
        complete: () => {
          this.loaderService.hide();
        },
        error: (error) => {
          this.loaderService.hide();
          this.toasterService.error(
            `Could not upload the file ${payload.File.name}`
          );
        },
      });
  }

  onSubmit() {
    let payload = this.createPayload();
    if (this.unitMediaForm.valid && payload) {
      this.uploadLinks(payload);
    }
  }

  createPayload() {
    let payload: { PropertyUnitId: string; PropertyId: string; Links: any[] } =
      {
        PropertyUnitId: this.formConfig.id,
        PropertyId: this.propertyId,
        Links: [],
      };
    Object.keys(this.unitMediaForm.controls).forEach((control: any) => {
      let formControl = this.unitMediaForm.get(control);
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
      case 'Video':
        return 'Video';
      case 'FloorPlan':
        return 'FloorPlan';
    }
  }

  uploadLinks(payload: any) {
    this.loaderService.show();
    this.propertyService.uploadPropertyMediaLink(payload).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        //this.toasterService.success(res.message);
        this.changeStep(ROUTE.CREATE_UNIT_FEATURES, res.message);
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
    this.unitService.reorderUnitImages(payload).subscribe({
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
    let payload: { PropertyUnitId: string; PropertyId: string; Media: any[] } =
      {
        PropertyUnitId: this.formConfig.id,
        PropertyId: this.propertyId,
        Media: [],
      };
    payload.Media = fileList.map((file: any, index: number) => {
      return { Position: index + 1, PropertyMediaId: file.Id };
    });
    return payload;
  }

  unitMediaUpdates(checked: boolean, type: string, form: FormGroup) {
    if (checked == false) {
      if (
        this.unitData?.media?.[type] &&
        this.unitData?.media?.[type]?.IsFile == 1
      ) {
        form.get('IsFile')?.setValue(checked);
        form.get('Url')?.setValue('');
        this.deletePdf(this.unitData?.media?.[type], type, true);
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

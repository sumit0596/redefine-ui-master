import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MediaService } from 'src/app/admin/services/media.service';
import {
  FILETYPE,
  FORM_MODE,
  INPUT_ERROR,
  MEDIA_FORM,
  ROUTE,
  SESSION,
} from 'src/app/models/constants';
import { ATTACHMENT_TYPE } from 'src/app/models/enum';
import { CommonStoreService } from 'src/app/services/common-store.service';

import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-media-form',
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.scss'],
})
export class MediaFormComponent {
  fileList: any[] = [];
  file: any = {};
  fileType: any = FILETYPE;
  fileContainer: any = {};
  formMode: any = FORM_MODE;
  formConfig!: any;
  categoryTagList!: any[];
  mediaFormGroup!: FormGroup;
  mediaDetails: any;
  selectedFile!: File;
  fileTypes: string[] = [
    FILETYPE.PDF,
    FILETYPE.EXCEL_SPREADSHEET,
    FILETYPE.MS_EXCEL,
    FILETYPE.IMAGE_JPEG,
    FILETYPE.IMAGE_PNG,
    FILETYPE.VIDEO_MP4,
    FILETYPE.WORD,
    FILETYPE.MS_WORD,
    FILETYPE.MS_WORD_XML,
  ];
  isTextVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private mediaService: MediaService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit() {
    this.mediaFormGroup = this.fb.group({
      SameName: [],
      File: [null, [Validators.required]],
    });
    await this.configureForm();
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        break;
    }
  }

  get brochure() {
    return this.mediaFormGroup.get('File') as FormControl;
  }

  createMedia(payload: any) {
    this.loaderService.show();
    this.mediaService.uploadMedia(payload).subscribe({
      next: (res) => {
        this.reset();
        this.loaderService.hide();
        this.goToManage(res.message);
      },
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  createPayload() {
    let payload = this.mediaFormGroup.value;
    Object.keys(this.fileContainer).forEach((key: string) => {
      if (key == MEDIA_FORM.FILE.NAME) {
        payload[key] = this.fileContainer.File
          ? this.fileContainer.File[0]
          : null;
      }
    });
    return payload;
  }

  onFileSelect(fileList: any[], type: number) {
    this.fileList = [...fileList];
    if (type == ATTACHMENT_TYPE.BROCHURE) {
      if (fileList.length == 0) {
        this.brochure.setValue(null);
      } else {
        this.brochure.setValue(fileList);
        Object.assign(this.fileContainer, { File: [...fileList] });
      }
    }
  }

  onFileDelete(event: any, type: number) {
    switch (type) {
      case ATTACHMENT_TYPE.BROCHURE:
        this.fileContainer.File.splice(event, 1);
        if (this.fileContainer.File.length === 0) {
          this.brochure.setValue(null);
        }
        break;
    }
  }
  validateForm() {
    Object.keys(this.mediaFormGroup.controls).forEach((control: any) => {
      this.setcontrolerror(control);
    });
  }

  checkerror(control: string, error: string) {
    return this.mediaFormGroup.get(control)?.hasError(error);
  }
  setcontrolerror(control: string) {
    let formcontrol = this.getControl(this.mediaFormGroup, control);
    if (this.checkerror(control, 'required')) {
      this.mediaFormGroup.get(control)?.setErrors({
        ...formcontrol.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkerror(control, 'minlength') ||
      this.checkerror(control, 'maxlength')
    ) {
      this.mediaFormGroup.get(control)?.setErrors({
        ...formcontrol.errors,
        invalid: INPUT_ERROR.NAME_PATTERN,
      });
    }
  }

  toggleTextVisibility(event: any) {
    this.isTextVisible = !this.isTextVisible;
  }

  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.mediaFormGroup.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createMedia(payload);
      }
    }
  }

  getControl(form: any, control: string): FormControl {
    return form.get(control) as FormControl;
  }
  getControlLabel(control: string) {
    let result: any = Object.values(MEDIA_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }

  displayError(error: any) {
    if (error) {
      let errors = JSON.parse(error);
      Object.keys(errors).forEach((err: any) => {
        this.toasterService.error(errors[err][0]);
      });
    }
  }

  reset() {
    this.fileContainer = undefined;
    this.fileList = [];
    this.mediaFormGroup.reset();
  }

  goToManage(message?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    message != undefined
      ? this.router.navigate([ROUTE.MANAGE_MEDIA]).then((m) => {
          this.toasterService.success(message);
        })
      : this.router.navigate([ROUTE.MANAGE_MEDIA]);
  }
}

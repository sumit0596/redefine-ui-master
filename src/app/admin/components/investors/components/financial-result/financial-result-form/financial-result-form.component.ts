import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  CONSTANTS,
  FILETYPE,
  FINANCIAL_RESULT_FORM,
  FORM_MODE,
  PATTERN,
  ROUTE,
  SESSION,
  STATUS,
} from 'src/app/models/constants';
import { ContextContainer } from 'src/app/core/context/context-container';
import { BaseComponent } from 'src/app/core/base.component';
import { Observable } from 'rxjs';
import { FinancialResultService } from 'src/app/admin/services/financial-result.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { REPORT_TYPE } from 'src/app/models/enum';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/services/common.service';
@Component({
  selector: 'app-financial-result-form',
  templateUrl: './financial-result-form.component.html',
  styleUrls: ['./financial-result-form.component.scss'],
})
export class FinancialResultFormComponent extends BaseComponent {
  formConfig: any;
  form!: FormGroup;
  formMode: any = FORM_MODE;
  financialResultDetails: any;
  fileTypes: string[] = [
    FILETYPE.PDF,
    FILETYPE.MS_EXCEL,
    FILETYPE.EXCEL_SPREADSHEET,
  ];
  imageTypes: string[] = [FILETYPE.IMAGE_JPEG, FILETYPE.IMAGE_PNG];
  status: any = STATUS;
  reportType: any = REPORT_TYPE;
  fileList: any[] = [];
  IsResult: boolean = true;
  IsPresentation: boolean = true;
  IsPressRelease: boolean = true;
  IsWebcastUrl: boolean = true;
  IsTranscript: boolean = true;
  IsShortformAdUrl: boolean = true;
  IsGroupAFS: boolean = true;
  IsCompanyAFS: boolean = true;

  fileContainer: { name: string; files: FileList }[] = [];

  pressReleaseList$!: Observable<any>;
  pressReleaseList!: any[];

  webcastList$!: Observable<any>;
  webcastList!: any[];

  typeList$!: Observable<any>;
  typeList!: any[];
  PublishDate: any;
  PublishTime: any;

  btnLable: string = '';

  picker: any;

  resultTypes$!: Observable<any>;
  resultTypes!: any[];

  resultDetails: any;
  minDate: Date = new Date();
  wecastList: any;
  presentationMedia: any;
  transcriptMedia: any;
  shortFormUrlMedia: any;
  groupAFSMedia: any;
  companyAFSMedia: any;
  propertyInformationMedia: any;
  bannerMedia: any;
  primaryFinancialMedia: any;
  JvFinancialMedia: any;
  EmpowermentTrustAFSMedia: any;
  resultsMedia: any;
  uploadedFiles: any = {};

  constructor(
    context: ContextContainer,
    private fb: FormBuilder,
    private financialResultService: FinancialResultService,
    private datePipe: DatePipe,
    private router: Router,
    private commonService: CommonService
  ) {
    super(context);
  }

  override ngOnDestroy(): void {
    this.financialResultService.pressReleaseSubject.next(undefined);
    this.financialResultService.resultTypeSubject.next(undefined);
  }
  override async ngOnInit() {
    this.initForm();
    this.getResultTypes();
    this.getPressRelease();
    await this.getWebcast();
    await this.configureForm();
    this.loadButtonLabel();
  }

  initForm() {
    this.form = this.fb.group({
      Title: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.ALPHA_NUMERIC.PATTERN),
          Validators.maxLength(255),
        ],
      ],
      Type: [null, [Validators.required]],
      Results: [null],
      Presentation: [null],
      PressRelease: [null],
      WebcastUrl: [null, [Validators.maxLength(500)]],
      Transcript: [null],
      ShortformAdUrl: [null],
      GroupAFS: [null],
      CompanyAFS: [null],
      PropertyInformation: [null],
      // Banner: [null],
      // BannerTitle: [
      //   null,
      //   [
      //     Validators.pattern(PATTERN.ALPHA_NUMERIC.PATTERN),
      //     Validators.maxLength(255),
      //   ],
      // ],
      PrimaryFinancialStatement: [null],
      JvFinancialInformation: [null],
      EmpowermentTrustAFS: [null],
      Description: [null],
      PublishDate: [null],
      PublishTime: [null],
    });
  }
  async configureForm() {
    this.getWebcast();
    this.getPressRelease();
    this.formConfig = await this.context.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        this.getControl(this.form, FINANCIAL_RESULT_FORM.TITLE.NAME)?.setValue(
          `${this.minDate.getFullYear()} Financial results`
        );
        break;
      case FORM_MODE.EDIT:
        this.getResultById(this.formConfig.id);
        break;
      case FORM_MODE.VIEW:
        this.form.disable();
        this.getResultById(this.formConfig.id);
        break;
      default:
        break;
    }
  }
  getResultById(id: number) {
    this.context.loaderService.show();
    this.financialResultService.getResultById(id).subscribe({
      next: (res) => {
        this.resultDetails = res;
        this.financialResultDetails = res;
        this.formatResultData();
        this.getWebcast();
        this.getPressRelease();
        this.fillFormData();
        this.context.loaderService.hide();
      },
      error: (error) => {
        this.context.loaderService.hide();
        this.context.toasterService.error(error.error.message);
      },
    });
  }
  private fillFormData() {
    // this.minDate =
    //   this.formConfig.mode == this.formMode.EDIT &&
    //   this.financialResultDetails.PublishDate
    //     ? this.financialResultDetails.PublishDate
    //     : new Date();
    Object.keys(this.form.controls).forEach((control) => {
      switch (control) {
        case FINANCIAL_RESULT_FORM.PRESS_RELEASE.NAME:
        case FINANCIAL_RESULT_FORM.WEBCAST_URL.NAME:
          this.form
            .get(control)
            ?.setValue(this.financialResultDetails[control]?.Value);
          break;
        // case FINANCIAL_RESULT_FORM.SHORTFORM_AD_URL.NAME:
        //   this.form
        //     .get(control)
        //     ?.setValue(this.financialResultDetails[control]?.Value);
        //   break;
        case FINANCIAL_RESULT_FORM.PUBLISH_DATE.NAME:
          this.form
            .get(control)
            ?.setValue(this.financialResultDetails[control]);
          if (this.financialResultDetails[control]) {
            this.form.get(control)?.clearValidators();
          }
          break;
        case FINANCIAL_RESULT_FORM.TITLE.NAME:
        case FINANCIAL_RESULT_FORM.TYPE.NAME:
        case FINANCIAL_RESULT_FORM.PUBLISH_TIME.NAME:
          this.form
            .get(control)
            ?.setValue(this.financialResultDetails[control]);
          break;
        default:
          this.form
            .get(control)
            ?.setValue(this.financialResultDetails[control]);
          break;
      }
      if (
        // control == FINANCIAL_RESULT_FORM.BANNER.NAME ||
        // control == FINANCIAL_RESULT_FORM.BANNER_TITLE.NAME ||
        control == FINANCIAL_RESULT_FORM.DESCRIPTION.NAME
      ) {
        this.toggleControl(
          control,
          this.financialResultDetails[FINANCIAL_RESULT_FORM.BANNER.NAME]
            ?.Checked &&
          control != FINANCIAL_RESULT_FORM.DESCRIPTION.NAME &&
          !this.isNullOrEmpty(this.financialResultDetails[control])
        );
      } else {
        this.toggleControl(
          control,
          !this.isNullOrEmpty(this.financialResultDetails[control])
        );
      }
    });
  }
  private formatResultData() {
    this.financialResultDetails = {
      ...this.financialResultDetails,
      Results: !this.isNullOrEmpty(this.financialResultDetails.Results)
        ? {
          Checked: true,
          Name: this.financialResultDetails.ResultsName,
          Url: this.financialResultDetails.Results,
          CreatedOn: this.financialResultDetails.CreatedOn,
        }
        : null,
      Presentation: !this.isNullOrEmpty(
        this.financialResultDetails.Presentation
      )
        ? {
          Checked: true,
          Name: this.financialResultDetails.PresentationName,
          Url: this.financialResultDetails.Presentation,
          CreatedOn: this.financialResultDetails.CreatedOn,
        }
        : null,
      Transcript: !this.isNullOrEmpty(this.financialResultDetails.Transcript)
        ? {
          Checked: true,
          Name: this.financialResultDetails.TranscriptName,
          Url: this.financialResultDetails.Transcript,
          CreatedOn: this.financialResultDetails.CreatedOn,
        }
        : null,
      ShortformAdUrl: !this.isNullOrEmpty(
        this.financialResultDetails.ShortformAdUrl
      )
        ? {
          Checked: true,
          Name: this.financialResultDetails.ShortformAdUrlName,
          Url: this.financialResultDetails.ShortformAdUrl,
          CreatedOn: this.financialResultDetails.CreatedOn,
        }
        : null,
      CompanyAFS: !this.isNullOrEmpty(this.financialResultDetails.CompanyAFS)
        ? {
          Checked: true,
          Name: this.financialResultDetails.CompanyAFSName,
          Url: this.financialResultDetails.CompanyAFS,
          CreatedOn: this.financialResultDetails.CreatedOn,
        }
        : null,
      PropertyInformation: !this.isNullOrEmpty(
        this.financialResultDetails.PropertyInformation
      )
        ? {
          Checked: true,
          Name: this.financialResultDetails.PropertyInformationName,
          Url: this.financialResultDetails.PropertyInformation,
          CreatedOn: this.financialResultDetails.CreatedOn,
        }
        : null,
      Banner: !this.isNullOrEmpty(this.financialResultDetails.Banner)
        ? {
          Checked: true,
          Name: this.financialResultDetails.BannerName,
          Url: this.financialResultDetails.Banner,
          CreatedOn: this.financialResultDetails.CreatedOn,
        }
        : null,
      GroupAFS: !this.isNullOrEmpty(this.financialResultDetails.GroupAFS)
        ? {
          Checked: true,
          Name: this.financialResultDetails.GroupAFSName,
          Url: this.financialResultDetails.GroupAFS,
          CreatedOn: this.financialResultDetails.CreatedOn,
        }
        : null,

      PrimaryFinancialStatement: !this.isNullOrEmpty(
        this.financialResultDetails.PrimaryFinancialStatement
      )
        ? {
          Checked: true,
          Name: this.financialResultDetails.PrimaryFinancialStatementName,
          Url: this.financialResultDetails.PrimaryFinancialStatement,
          CreatedOn: this.financialResultDetails.CreatedOn,
        }
        : null,
      JvFinancialInformation: !this.isNullOrEmpty(
        this.financialResultDetails.JvFinancialInformation
      )
        ? {
          Checked: true,
          Name: this.financialResultDetails.JvFinancialInformationName,
          Url: this.financialResultDetails.JvFinancialInformation,
          CreatedOn: this.financialResultDetails.CreatedOn,
        }
        : null,

      EmpowermentTrustAFS: !this.isNullOrEmpty(
        this.financialResultDetails.EmpowermentTrustAFS
      )
        ? {
          Checked: true,
          Name: this.financialResultDetails.EmpowermentTrustAFSName,
          Url: this.financialResultDetails.EmpowermentTrustAFS,
          CreatedOn: this.financialResultDetails.CreatedOn,
        }
        : null,

      PressRelease: !this.isNullOrEmpty(
        this.financialResultDetails.PressRelease
      )
        ? {
          Checked: true,
          Value: this.financialResultDetails.PressRelease,
        }
        : null,
      WebcastUrl: !this.isNullOrEmpty(this.financialResultDetails.WebcastUrl)
        ? {
          Checked: true,
          Value: this.financialResultDetails.WebcastUrl,
        }
        : null,
      // ShortformAdUrl: !this.isNullOrEmpty(
      //   this.financialResultDetails.ShortformAdUrl
      // )
      //   ? {
      //       Checked: true,
      //       Value: this.financialResultDetails.ShortformAdUrl,
      //     }
      //   : null,
    };

    this.uploadedFiles['Results'] = !this.isNullOrEmpty(
      this.financialResultDetails.Results
    )
      ? true
      : false;
    this.uploadedFiles['Presentation'] = !this.isNullOrEmpty(
      this.financialResultDetails.Presentation
    )
      ? true
      : false;
    this.uploadedFiles['Transcript'] = !this.isNullOrEmpty(
      this.financialResultDetails.Transcript
    )
      ? true
      : false;
    this.uploadedFiles['ShortformAdUrl'] = !this.isNullOrEmpty(
      this.financialResultDetails.ShortformAdUrl
    )
      ? true
      : false;
    this.uploadedFiles['CompanyAFS'] = !this.isNullOrEmpty(
      this.financialResultDetails.CompanyAFS
    )
      ? true
      : false;
    this.uploadedFiles['Banner'] = !this.isNullOrEmpty(
      this.financialResultDetails.Banner
    )
      ? true
      : false;
    this.uploadedFiles['PropertyInformation'] = !this.isNullOrEmpty(
      this.financialResultDetails.PropertyInformation
    )
      ? true
      : false;
    this.uploadedFiles['PrimaryFinancialStatement'] = !this.isNullOrEmpty(
      this.financialResultDetails.PrimaryFinancialStatement
    )
      ? true
      : false;
    this.uploadedFiles['JvFinancialInformation'] = !this.isNullOrEmpty(
      this.financialResultDetails.JvFinancialInformation
    )
      ? true
      : false;
    this.uploadedFiles['EmpowermentTrustAFS'] = !this.isNullOrEmpty(
      this.financialResultDetails.EmpowermentTrustAFS
    )
      ? true
      : false;
    this.uploadedFiles['PressRelease'] = !this.isNullOrEmpty(
      this.financialResultDetails.PressRelease
    )
      ? true
      : false;
    this.uploadedFiles['WebcastUrl'] = !this.isNullOrEmpty(
      this.financialResultDetails.WebcastUrl
    )
      ? true
      : false;

    this.resultsMedia = !this.isNullOrEmpty(
      this.financialResultDetails.ResultsMediaId
    )
      ? {
        Checked: true,
        MediaId: this.financialResultDetails.ResultsMediaId,
        Name: this.financialResultDetails.ResultsName,
        Url: this.financialResultDetails.Results.Url,
        CreatedOn: this.financialResultDetails.CreatedOn,
      }
      : null;
    this.presentationMedia = !this.isNullOrEmpty(
      this.financialResultDetails.PresentationMediaId
    )
      ? {
        Checked: true,
        MediaId: this.financialResultDetails.PresentationMediaId,
        Name: this.financialResultDetails.PresentationName,
        Url: this.financialResultDetails.Presentation.Url,
        CreatedOn: this.financialResultDetails.CreatedOn,
      }
      : null;
    this.transcriptMedia = !this.isNullOrEmpty(
      this.financialResultDetails.TranscriptMediaId
    )
      ? {
        Checked: true,
        MediaId: this.financialResultDetails.TranscriptMediaId,
        Name: this.financialResultDetails.TranscriptName,
        Url: this.financialResultDetails.Transcript.Url,
        CreatedOn: this.financialResultDetails.CreatedOn,
      }
      : null;
    this.shortFormUrlMedia = !this.isNullOrEmpty(
      this.financialResultDetails.ShortformAdUrlMediaId
    )
      ? {
        Checked: true,
        MediaId: this.financialResultDetails.ShortformAdUrlMediaId,
        Name: this.financialResultDetails.ShortformAdUrlName,
        Url: this.financialResultDetails.ShortformAdUrl.Url,
        CreatedOn: this.financialResultDetails.CreatedOn,
      }
      : null;
    this.companyAFSMedia = !this.isNullOrEmpty(
      this.financialResultDetails.CompanyAFSMediaId
    )
      ? {
        Checked: true,
        MediaId: this.financialResultDetails.CompanyAFSMediaId,
        Name: this.financialResultDetails.CompanyAFSName,
        Url: this.financialResultDetails.CompanyAFS.Url,
        CreatedOn: this.financialResultDetails.CreatedOn,
      }
      : null;
    this.propertyInformationMedia = !this.isNullOrEmpty(
      this.financialResultDetails.PropertyInformationMediaId
    )
      ? {
        Checked: true,
        MediaId: this.financialResultDetails.PropertyInformationMediaId,
        Name: this.financialResultDetails.PropertyInformationName,
        Url: this.financialResultDetails.PropertyInformation.Url,
        CreatedOn: this.financialResultDetails.CreatedOn,
      }
      : null;
    this.bannerMedia = !this.isNullOrEmpty(
      this.financialResultDetails.BannerMediaId
    )
      ? {
        Checked: true,
        MediaId: this.financialResultDetails.BannerMediaId,
        Name: this.financialResultDetails.BannerName,
        Url: this.financialResultDetails.Banner.Url,
        CreatedOn: this.financialResultDetails.CreatedOn,
      }
      : null;
    this.groupAFSMedia = !this.isNullOrEmpty(
      this.financialResultDetails.GroupAFSMediaId
    )
      ? {
        Checked: true,
        MediaId: this.financialResultDetails.GroupAFSMediaId,
        Name: this.financialResultDetails.GroupAFSName,
        Url: this.financialResultDetails.GroupAFS.Url,
        CreatedOn: this.financialResultDetails.CreatedOn,
      }
      : null;
    this.JvFinancialMedia = !this.isNullOrEmpty(
      this.financialResultDetails.JvFinancialInformationMediaId
    )
      ? {
        Checked: true,
        MediaId: this.financialResultDetails.JvFinancialInformationMediaId,
        Name: this.financialResultDetails.JvFinancialInformationName,
        Url: this.financialResultDetails.JvFinancialInformation.Url,
        CreatedOn: this.financialResultDetails.CreatedOn,
      }
      : null;
    this.EmpowermentTrustAFSMedia = !this.isNullOrEmpty(
      this.financialResultDetails.EmpowermentTrustAFSMediaId
    )
      ? {
        Checked: true,
        MediaId: this.financialResultDetails.EmpowermentTrustAFSMediaId,
        Name: this.financialResultDetails.EmpowermentTrustAFSName,
        Url: this.financialResultDetails.EmpowermentTrustAFS.Url,
        CreatedOn: this.financialResultDetails.CreatedOn,
      }
      : null;
    this.primaryFinancialMedia = !this.isNullOrEmpty(
      this.financialResultDetails.PrimaryFinancialStatementMediaId
    )
      ? {
        Checked: true,
        MediaId: this.financialResultDetails.PrimaryFinancialStatementMediaId,
        Name: this.financialResultDetails.PrimaryFinancialStatementName,
        Url: this.financialResultDetails.PrimaryFinancialStatement.Url,
        CreatedOn: this.financialResultDetails.CreatedOn,
      }
      : null;
  }
  async getResultTypes() {
    this.resultTypes$ =
      await this.financialResultService.getResultTypeDropdownData();
    this.resultTypes$.subscribe({
      next: (res) => {
        this.resultTypes = res;
      },
      error: (error) => { },
    });
  }
  getPressRelease() {
    this.pressReleaseList$ =
      this.financialResultService.getPressReleaseDropdownData();
    this.pressReleaseList$.subscribe({
      next: (res: any) => {
        this.pressReleaseList = res;
      },
      error: (error: any) => { },
    });
  }

  getWebcast() {
    this.webcastList$ = this.financialResultService.getWebCastDropdownData();
    this.webcastList$.subscribe({
      next: (res: any) => {
        this.webcastList = res;
      },
      error: (error: any) => { },
    });
  }

  editResult() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
      access: this.formConfig.access,
    };
    this.context.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.EDIT_FINANCIAL_RESULT}`]);
  }
  deleteResult() {
    const dialogRef = this.context.commonService.dialog(
      CONSTANTS.FINANCIAL_RESULT_DELETE_CONFIRMATION,
      CONSTANTS.NO,
      CONSTANTS.YES
    );
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action === CONSTANTS.YES) {
        this.context.loaderService.show();
        this.financialResultService
          .deleteResult(this.resultDetails.FinancialResultsId)
          .subscribe({
            next: (res) => {
              this.context.loaderService.hide();
              this.goToMain(res.message);
            },
            error: (error) => {
              this.context.loaderService.hide();
              this.context.toasterService.error(error.error.message);
            },
          });
      }
    });
  }

  toggleControl(control: string, enable: boolean) {
    if (enable) {
      this.form.get(control)?.addValidators([Validators.required]);
    } else {
      this.financialResultDetails[control] = null;
      this.form.get(control)?.removeValidators(Validators.required);
    }
    this.form.get(control)?.updateValueAndValidity();
  }

  onPublishingDateChange(event: any) { }
  onPublishingTimeChange(event: any) { }

  updateFileContainer(file: any, name: string) {
    let i = this.fileContainer.findIndex((f) => f.name == name);
    if (i != -1) {
      this.fileContainer[i] = file;
    } else {
      this.fileContainer.push(file);
    }
  }

  toggleSwitch(event: any, media: any) {
    var controlName = event.label;
    if (event.checked && !this.uploadedFiles[controlName]) {
      this.financialResultDetails = {
        ...this.financialResultDetails,
        [controlName]: {
          Checked: event.checked,
        },
      };
      if (controlName == FINANCIAL_RESULT_FORM.BANNER.NAME) {
        this.toggleControl(
          FINANCIAL_RESULT_FORM.BANNER_TITLE.NAME,
          event.checked
        );
      }
      this.toggleControl(controlName, event.checked);
    } else if (
      this.getControl(this.form, controlName)?.value &&
      !Object.prototype.hasOwnProperty.call(
        this.getControl(this.form, controlName)?.value,
        'File'
      )
    ) {
      let dialogRef = this.context.commonService.showModal(
        'Please Note',
        'Disabling the switch will erase data, are you sure?'
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.uploadedFiles[controlName] = false;
          if (media != null) {
            this.deleteFile(controlName, media);
          }
          this.financialResultDetails[controlName] = null;
          this.form.get(controlName)?.setValue(null);
          this.getControl(this.form, controlName)?.setValue('');
          //this.toggleControl(controlName, event.checked);
          this.toggleControl(controlName, false);
          if (controlName == FINANCIAL_RESULT_FORM.BANNER.NAME) {
            this.toggleControl(
              FINANCIAL_RESULT_FORM.BANNER_TITLE.NAME,
              event.checked
            );

            this.getControl(
              this.form,
              FINANCIAL_RESULT_FORM.BANNER_TITLE.NAME
            )?.setValue('');
            this.getControl(
              this.form,
              FINANCIAL_RESULT_FORM.DESCRIPTION.NAME
            )?.setValue('');

            this.financialResultDetails[
              FINANCIAL_RESULT_FORM.BANNER_TITLE.NAME
            ] = null;
            this.financialResultDetails[
              FINANCIAL_RESULT_FORM.DESCRIPTION.NAME
            ] = null;
          }
        } else {
          this.financialResultDetails = {
            ...this.financialResultDetails,
            [controlName]: {
              Checked: true,
            },
          };
        }
      });
    } else {
      this.financialResultDetails[controlName] = null;
      this.getControl(this.form, controlName)?.setValue(null);
      this.toggleControl(controlName, event.checked);
      if (controlName == FINANCIAL_RESULT_FORM.BANNER.NAME) {
        this.toggleControl(
          FINANCIAL_RESULT_FORM.BANNER_TITLE.NAME,
          event.checked
        );
      }
    }
  }
  toggleBannerFields(checked: boolean) { }
  updateValidation() {
    if (this.formConfig.mode != this.formMode.CREATE) {
      [
        FINANCIAL_RESULT_FORM.COMPANY_AFS,
        FINANCIAL_RESULT_FORM.PROPERTY_INFORMATION,
        FINANCIAL_RESULT_FORM.GROUP_AFS,
        FINANCIAL_RESULT_FORM.PRESENTATION,
        FINANCIAL_RESULT_FORM.PRESS_RELEASE,
        FINANCIAL_RESULT_FORM.RESULTS,
        FINANCIAL_RESULT_FORM.SHORTFORM_AD_URL,
        FINANCIAL_RESULT_FORM.TRANSCRIPTS,
        FINANCIAL_RESULT_FORM.WEBCAST_URL,
      ].forEach((control) => {
        if (this.resultDetails[control.NAME]) {
          this.form.controls[control.NAME].setValidators([Validators.required]);
        } else {
          this.form.controls[control.NAME].clearValidators();
        }
        this.form.controls[control.NAME].updateValueAndValidity();
      });
    }
  }

  get permissions() {
    return this.form.get('Permission') as FormArray;
  }

  onSubmit(event: any) {
    event.preventDefault();
    if (this.form.valid) {
      let data = this.transformData();
      if (
        this.getControl(this.form, FINANCIAL_RESULT_FORM.PUBLISH_DATE.NAME)
          ?.value == null ||
        this.getControl(this.form, FINANCIAL_RESULT_FORM.PUBLISH_TIME.NAME)
          ?.value == null
      ) {
        this.displayWarningPopUp(data);
      } else {
        this.displayConfirmationPopUp(data);
      }
    } else {
      this.validateForm();
    }
  }
  displayWarningPopUp(data: any) {
    let dialogRef = this.context.commonService.showModal(
      'Please Note',
      'You have not yet set a publishing date and time',
      'Click yes to proceed and save your work as draft'
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.formConfig.mode == this.formMode.CREATE) {
          this.createFinancialResult(data);
        } else if (this.formConfig.mode == this.formMode.EDIT) {
          this.updateFinancialResult(data);
        }
      }
    });
  }
  displayConfirmationPopUp(data: any) {
    let dialogRef = this.context.commonService.showModal(
      'Please Note',
      null,
      `Your new Financial Results will be published on <span class='rd-text-mid-red'>${this.datePipe.transform(
        this.getControl(this.form, FINANCIAL_RESULT_FORM.PUBLISH_DATE.NAME)
          ?.value,
        'd MMM y'
      )}</span> at <span class='rd-text-mid-red'>${this.getControl(this.form, FINANCIAL_RESULT_FORM.PUBLISH_TIME.NAME)
        ?.value
      }</span>
    <br>
    <br>
    The previous Financial Results will be auto-archived when this is live.`,
      'Continue',
      'Cancel'
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.formConfig.mode == this.formMode.CREATE) {
          this.createFinancialResult(data);
        } else if (this.formConfig.mode == this.formMode.EDIT) {
          this.updateFinancialResult(data);
        }
      }
    });
  }
  onChange(event: any) {
    this.validateFormField(event);
  }
  onSave(status: any = undefined) { }
  private transformData() {
    const data = this.form.value;
    Object.keys(data).forEach((key: any) => {
      if (key == FINANCIAL_RESULT_FORM.PUBLISH_DATE.NAME) {
        data.PublishDate = this.datePipe.transform(
          data.PublishDate,
          'yyyy-MM-dd'
        );
      } else if (data[key] instanceof Object) {
        if (
          Object.prototype.hasOwnProperty.call(data[key], 'File') &&
          data[key].File instanceof File
        ) {
          data[key] = data[key].File;
        } else {
          delete data[key];
        }
      }
    });
    return data;
  }

  updateFinancialResult(data: any) {
    this.context.loaderService.show();
    this.financialResultService
      .updateResult(data, this.resultDetails.FinancialResultsId)
      .subscribe({
        next: (res) => {
          this.context.loaderService.hide();
          this.goToMain(res.message);
        },
        error: (error) => {
          this.context.loaderService.hide();
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.context.toasterService.error(error.error.message);
        },
      });
  }

  createFinancialResult(data: any) {
    this.context.loaderService.show();
    this.financialResultService.createResult(data).subscribe({
      next: (res) => {
        this.reset();
        this.context.loaderService.hide();
        this.goToMain(res.message);
      },
      error: (error) => {
        this.context.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
  }
  deleteFile(type: string, event: any) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.context.loaderService.show();
        this.financialResultService.deleteMedia(event.MediaId, type).subscribe({
          next: (res: any) => {
            this.form.get(type)?.setValue(null);
            this.setFileValues(type, event);
            // this.toggleControl(type, true);
            this.context.loaderService.hide();
            this.context.toasterService.success(res.message);
          },
          error: (error) => {
            this.context.loaderService.hide();
            this.context.toasterService.error(error.error.message);
          },
        });
      }
    });
  }

  private validateForm() {
    Object.keys(this.form.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }

  private setControlError(control: string) {
    let formControl: FormControl = this.form.get(control) as FormControl;
    if (formControl.hasError('required')) {
      formControl.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      formControl.hasError('minlength') ||
      formControl.hasError('maxlength')
    ) {
      formControl.setErrors({
        ...formControl.errors,
        invalid: `Maximum ${this.getControl(this.form, control)?.getError('maxlength')
          ?.requiredLength
          } characters are allowed`,
      });
    }
  }
  private checkError(control: string, error: string) {
    return this.form.get(control)?.hasError(error);
  }

  goToMain(message?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    message != undefined
      ? this.router.navigate([`${ROUTE.MANAGE_FINANCIAL_RESULT}`]).then((m) => {
        this.context.toasterService.success(message);
      })
      : this.router.navigate([`${ROUTE.MANAGE_FINANCIAL_RESULT}`]);
  }

  private displayError(error: any) {
    if (error) {
      let errors = JSON.parse(error);
      Object.keys(errors).forEach((err: any) => {
        this.context.toasterService.error(errors[err][0]);
      });
    }
  }
  private reset() {
    this.fileContainer = [];
    this.fileList = [];
    this.form.reset();
  }

  loadButtonLabel() {
    if (this.formConfig) {
      this.btnLable = 'Submit';
      if (this.formConfig.mode == this.formMode.VIEW) this.btnLable = 'Edit';
      else if (this.formConfig.mode == this.formMode.EDIT) {
        this.btnLable = 'Save & Update';
      }
    }
  }
  onFileDelete(event: any, type: string) {
    this.uploadedFiles[type] = false;
    if (this.formConfig.mode == FORM_MODE.CREATE) {
      this.form.get(type)?.setValue(null);
    } else {
      this.deleteFile(type, event);
      this.financialResultDetails = {
        ...this.financialResultDetails,
        [type]: {
          Checked: true,
        },
      };
    }
  }
  isNullOrEmpty(data: any): boolean {
    return data == null || data == undefined || data == '';
  }

  /*********************************************************
   *                      Form validations                 *
   ********************************************************/

  validateFormField(data: any) {
    let control = this.getControl(data.form, data.control);
    if (control?.hasError('required')) {
      control?.setErrors({
        ...control.errors,
        invalid: `${this.getControlLabel(data.control)} is required`,
      });
    } else if (control?.hasError('minlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Minimum ${control.getError('minlength')?.requiredLength
          }  characters are allowed`,
      });
    } else if (control?.hasError('maxlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Maximum ${control.getError('maxlength')?.requiredLength
          } characters are allowed`,
      });
    } else if (control?.hasError('pattern')) {
      control?.setErrors({
        ...control.errors,
        invalid: this.getControlPatternMessage(data.control),
      });
    }
  }
  getControl(
    form: FormGroup | FormArray,
    control: string,
    i: number = 0
  ): FormGroup | FormArray | FormControl | undefined {
    if (form instanceof FormGroup) {
      return form.get(control) as FormControl;
    } else if (form instanceof FormArray) {
      return form.at(i).get(control) as FormControl;
    } else {
      return undefined;
    }
  }
  getControlLabel(control: string) {
    let result: any = Object.values(FINANCIAL_RESULT_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(FINANCIAL_RESULT_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  onFileSelect(fileList: any[], type: string) {
    this.uploadedFiles[type] = true;
    this.upload(fileList[0], type);
  }

  upload(file: any, type: any) {
    this.financialResultService.uploadMedia(file, type).subscribe({
      next: (res: any) => {
        // this.form.get(type)?.setValue({
        //   Url: res.data.Url,
        //   Name: res.data.Name,
        //   MediaId: res.data.MediaId,
        //   CreatedOn: res.data.CreatedOn,
        // });
        switch (type) {
          case 'Presentation':
            this.presentationMedia = {
              Url: res.data.Url,
              Name: res.data.Name,
              MediaId: res.data.MediaId,
              CreatedOn: res.data.CreatedOn,
            };
            break;
          case 'Results':
            this.resultsMedia = {
              Checked: true,
              Url: res.data.Url,
              Name: res.data.Name,
              MediaId: res.data.MediaId,
              CreatedOn: res.data.CreatedOn,
            };
            break;
          case 'Transcript':
            this.transcriptMedia = {
              Url: res.data.Url,
              Name: res.data.Name,
              MediaId: res.data.MediaId,
              CreatedOn: res.data.CreatedOn,
            };
            break;
          case 'ShortformAdUrl':
            this.shortFormUrlMedia = {
              Url: res.data.Url,
              Name: res.data.Name,
              MediaId: res.data.MediaId,
              CreatedOn: res.data.CreatedOn,
            };
            break;
          case 'GroupAFS':
            this.groupAFSMedia = {
              Url: res.data.Url,
              Name: res.data.Name,
              MediaId: res.data.MediaId,
              CreatedOn: res.data.CreatedOn,
            };
            break;
          case 'CompanyAFS':
            this.companyAFSMedia = {
              Url: res.data.Url,
              Name: res.data.Name,
              MediaId: res.data.MediaId,
              CreatedOn: res.data.CreatedOn,
            };
            break;
          case 'PropertyInformation':
            this.propertyInformationMedia = {
              Url: res.data.Url,
              Name: res.data.Name,
              MediaId: res.data.MediaId,
              CreatedOn: res.data.CreatedOn,
            };
            break;
          case 'Banner':
            this.bannerMedia = {
              Url: res.data.Url,
              Name: res.data.Name,
              MediaId: res.data.MediaId,
              CreatedOn: res.data.CreatedOn,
            };
            break;
          case 'PrimaryFinancialStatement':
            this.primaryFinancialMedia = {
              Url: res.data.Url,
              Name: res.data.Name,
              MediaId: res.data.MediaId,
              CreatedOn: res.data.CreatedOn,
            };
            break;
          case 'JvFinancialInformation':
            this.JvFinancialMedia = {
              Url: res.data.Url,
              Name: res.data.Name,
              MediaId: res.data.MediaId,
              CreatedOn: res.data.CreatedOn,
            };
            break;
          case 'EmpowermentTrustAFS':
            this.EmpowermentTrustAFSMedia = {
              Url: res.data.Url,
              Name: res.data.Name,
              MediaId: res.data.MediaId,
              CreatedOn: res.data.CreatedOn,
            };
            break;
        }
        this.form.get(type)?.setValue(res.data.MediaId);
        this.context.toasterService.success(res.message);
      },
      error: (error: any) => {
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
  }

  setFileValues(type: any, event: any) {
    switch (type) {
      case 'Presentation':
        this.presentationMedia = null;
        break;
      case 'Results':
        this.resultsMedia = null;
        break;
      case 'Transcript':
        this.transcriptMedia = null;
        break;
      case 'ShortformAdUrl':
        this.shortFormUrlMedia = null;
        break;
      case 'GroupAFS':
        this.groupAFSMedia = null;
        break;
      case 'CompanyAFS':
        this.companyAFSMedia = null;
        break;
      case 'PropertyInformation':
        this.propertyInformationMedia = null;
        break;
      case 'Banner':
        this.bannerMedia = null;
        break;
      case 'PrimaryFinancialStatement':
        this.primaryFinancialMedia = null;
        break;
      case 'JvFinancialInformation':
        this.JvFinancialMedia = null;
        break;
      case 'EmpowermentTrustAFS':
        this.EmpowermentTrustAFSMedia = null;
        break;
    }
  }

  onSelect(control: any, value: any) {
    this.uploadedFiles[control.control] = value != null;
  }
}

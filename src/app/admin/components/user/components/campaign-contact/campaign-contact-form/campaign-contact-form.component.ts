import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { SettingService } from 'src/app/admin/services/setting.service';
import { CAMPAIGN_CONTACT, FORM_MODE, INPUT_ERROR, PATTERN, ROUTE, SESSION } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-campaign-contact-form',
  templateUrl: './campaign-contact-form.component.html',
  styleUrls: ['./campaign-contact-form.component.scss']
})
export class CampaignContactFormComponent {
  formMode: any = FORM_MODE;
  formConfig!: any;
  settingDetails: any;
  fileList: any[] = [];
  fileContainer: any = {};
  settingForm!: FormGroup;
  campaignContactForm!: FormGroup;
  campaignDetails : any ;
  type$: Observable<any> = of([
    {
      id: 1,
      label: 'Active',
    },
    {
      id: 0,
      label: 'In-Active',
    },
  ]);
  constructor(private commonStoreService: CommonStoreService,
    private router: Router,
    private toasterService: ToastrService,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private settingService: SettingService,
  ){
    
  }

  async ngOnInit() {
    this.campaignContactForm = this.fb.group({
      CampaignName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
      Name: [
        '',
        [
          Validators.pattern(PATTERN.NAME_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      Email: [
        '',
        [
          Validators.pattern(PATTERN.EMAIL_PATTERN),
          Validators.maxLength(255),
        ],
      ],
      Mobile: [
        '',
        [
          Validators.pattern(PATTERN.NUMERIC_PLUS_SPACE_PATTERN.PATTERN),
          Validators.minLength(9),
          Validators.maxLength(16),
        ],
      ],
      DisableMobile : [0],
      Status: [1]
    });
    await this.configureForm();
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        //this.getCategory();
        break;
      case FORM_MODE.EDIT:
        this.getCampaignDetailsById(this.formConfig.id);
        break;
      case FORM_MODE.VIEW:
          this.campaignContactForm.disable();
          this.getCampaignDetailsById(this.formConfig.id);
          break;
      default:
        break;
    }
  }

  getCampaignDetailsById(id: number) {
    this.loaderService.show();
    this.settingService.getCampaignSettingDetails(id).subscribe({
      next: (res) => {
        this.campaignDetails = res;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }

  goToManage(res?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    let formConfig = {
      tab: 2,
    };
    this.commonStoreService.setFormConfig(formConfig);
    res?.message != undefined
      ? this.router.navigate([ROUTE.MANAGE_SETTINGS]).then((m) => {
          this.toasterService.success(res.message);
        })
      : this.router.navigate([ROUTE.MANAGE_SETTINGS]);
  }

  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.campaignContactForm.valid) {
        let payload = this.createPayload();
        if (this.formConfig.mode == FORM_MODE.CREATE) {
          this.createCampaignContact(payload);
        }
        if (this.formConfig.mode == FORM_MODE.EDIT) {
           this.updateCampaignContact(payload);
        }
    }
  }

  createPayload() {
    let payload = this.campaignContactForm.getRawValue();
    return payload;
  }

  fillFormData() {
    Object.keys(this.campaignContactForm.controls).forEach((control) => {
      this.campaignContactForm
          .get(control)
          ?.setValue(this.campaignDetails[control]);
      
    });
  }

 
  onSwitchToggle(event: any) {
    if (event.checked) {
        this.campaignContactForm.get('DisableMobile')?.setValue(1);
      } else {
        this.campaignContactForm.get('DisableMobile')?.setValue(0);
    }
  }

  validateForm() {
    Object.keys(this.campaignContactForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }

  setControlError(control: string) {
    let formControl = this.getControl(this.campaignContactForm, control);
   
    if (this.checkError(control, 'required')) {
      this.campaignContactForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (this.checkError(control, 'pattern')) {

        if (control == CAMPAIGN_CONTACT.NAME.NAME) {
          if(this.campaignContactForm.get(control)?.value!=''){
            this.campaignContactForm.get(control)?.setErrors({
              ...formControl.errors,
              invalid: INPUT_ERROR.ALPHABETS_PATTERN,
            });
            
          } else if(this.campaignContactForm.get(control)?.value!='' &&  this.checkError(control, 'maxlength')){
            if (
              control == CAMPAIGN_CONTACT.NAME.NAME
            ) {
              this.campaignContactForm.get(control)?.setErrors({
                required: false,
                invalid: INPUT_ERROR.NAME_PATTERN,
              });
            }
          }
        }  
    
        if (control == CAMPAIGN_CONTACT.EMAIL.NAME) {
          if(this.campaignContactForm.get(control)?.value!=''){
            this.campaignContactForm.get(control)?.setErrors({
              required: false,
              invalid: `${this.getControlLabel(control)} ${
                INPUT_ERROR.EMAIL_PATTERN
              }`,
            });
          }
        }
        
        if (this.campaignContactForm.get(control)?.value!='' && control == CAMPAIGN_CONTACT.MOBILE.NAME){
          if(this.campaignContactForm.get(control)?.value!=''){
            this.campaignContactForm.get(control)?.setErrors({
              required: false,
              invalid: INPUT_ERROR.NUMERIC_MOBILE_PATTERM,
            });
          }
        }
    } else if (formControl.hasError('minlength')) {
      formControl?.setErrors({
        ...formControl.errors,
        invalid: `Minimum ${
          formControl.getError('minlength')?.requiredLength
        } characters are allowed`,
      });
    } else if (formControl.hasError('maxlength')) {
      formControl?.setErrors({
        ...formControl.errors,
        invalid: `Maximum ${
          formControl.getError('maxlength')?.requiredLength
        } characters are allowed`,
      });
    }
    
  }

  checkError(control: string, error: string) {
    return this.campaignContactForm.get(control)?.hasError(error);
  }

  getControl(form: any, control: string): FormControl {
    return form?.get(control) as FormControl;
  }

  getControlLabel(control: string) {
    let result: any = Object.values(CAMPAIGN_CONTACT).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }

  createCampaignContact(payload : any){
    this.loaderService.show();
   
    this.settingService.postCampaignContact(payload).subscribe({
      next: (res: any) => {
        this.router.navigateByUrl(`${ROUTE.MANAGE_SETTINGS}`).then((m) => {
          this.goToManage(res);
        });
        this.loaderService.hide();
        this.campaignContactForm.reset();
      },
      complete: () => {
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

  updateCampaignContact(payload : any){
    this.loaderService.show();
    this.settingService.updateCampaignContact(
      payload,
      this.campaignDetails.CampaignContactId
    ).subscribe({
      next: (res) => {
        this.loaderService.hide();
        this.goToManage(res);
      },
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }

  editCampaignContact() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.EDIT_CAMPAIGN_CONTACT_DETAILS}`]);
  }
}

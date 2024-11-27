import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { Role } from 'src/app/models/roles';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  FORM_MODE,
  INPUT_ERROR,
  PATTERN,
  ROLE_FORM,
  ROUTE,
  SESSION,
} from 'src/app/models/constants';
import { Router } from '@angular/router';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { CustomValidator } from '../../../../../utilities/custom-validator';
import { RolesServiceService } from 'src/app/admin/services/roles.service.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.scss'],
})
export class RolesFormComponent {
  formConfig!: any;
  formMode: any = FORM_MODE;
  roleForm!: FormGroup;
  permissionList: any = [];
  selectedPermissionList: any[] = [];
  mergedPermissionList: any[] = [];
  successMessage!: string;
  errorMessage!: string;
  permissionSelected: any;
  role!: Role;
  submitted = false;
  roleDetails: any;
  selectedCheckBox: number = 0;
  getRoleId: number = 0;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private rolesService: RolesServiceService,
    private commonStoreService: CommonStoreService,
    private localStorageService: LocalStorageService
  ) { }

  async ngOnInit() {
    this.roleForm = this.fb.group({
      Name: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(PATTERN.NAME_PATTERN),
        ],
      ],
      Description: ['', Validators.required],
      Permission: this.fb.array([], CustomValidator.permissionValidator),
    });
    await this.getPermissions();
  }

  get permissions() {
    return this.roleForm.get('Permission') as FormArray;
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        this.bindPermission();
        break;
      case FORM_MODE.EDIT:
        this.getRoleById(this.formConfig.id);
        break;
    }
  }

  getRoleById(id: any) {
    this.loaderService.show();
    this.rolesService.getRoleById(id).subscribe({
      next: async (res) => {
        this.getRoleId = res.data.RoleId;
        this.roleDetails = res.data;
        this.selectedPermissionList = res.data.Permission;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  async getPermissions() {
    let roleid = this.localStorageService.getStorageWithoutExpire(SESSION.FORM_CONFIG);
    this.loaderService.show();
    this.rolesService.getPermissionList().subscribe({
      next: async (res) => {
        this.loaderService.hide();
        let listOfPermission = await res.data;
        if (listOfPermission.length > 0) {
          if (roleid.id != 2) {
            listOfPermission[0]['SubMenu'].shift();
          } else {
            let brokerDashboard = listOfPermission[0]['SubMenu'].slice(0, 1);
            listOfPermission[0]['SubMenu'] = brokerDashboard
          }
        }
        this.permissionList = listOfPermission;
        this.configureForm();
      },
      error: (error) => {
        this.loaderService.hide();
      },
    });
  }
  fillFormData() {
    Object.keys(this.roleForm.controls).forEach((control) => {
      if (control === 'Permission') {
        this.bindPermission();
      } else {
        if (this.roleDetails[control]) {
          this.roleForm.get(control)?.setValue(this.roleDetails[control]);
        }
      }
    });
  }
  bindPermission() {
    var ids = new Set(
      this.selectedPermissionList
        .filter((p) => p.Checked)
        .map((p: any) => p.PermissionId)
    );

    this.mergedPermissionList = this.permissionList.map((permission: any) => {
      [...permission.SubMenu].map((menu: any) => {
        let selectedPermission = this.selectedPermissionList.find(
          (p: any) => p.PermissionId == menu.PermissionId
        );
        if (selectedPermission) {
          return Object.assign(menu, {
            Checked: selectedPermission.Checked,
            PermissionType: selectedPermission.PermissionType,
          });
        } else {
          return Object.assign(menu, {
            Checked: false,
            PermissionType: '',
          });
        }
      });
      return permission;
    });
    this.mergedPermissionList.forEach((permission: any) => {
      this.permissions.push(this.createPermissionForm(permission));
    });
  }
  createPermissionForm(permissionData: any) {
    let isChecked = [...permissionData.SubMenu].every(
      (menu: any) => menu.Checked
    );
    let permission = this.fb.group({
      Name: [permissionData.Name],
      Checked: isChecked,
      SubPermission: this.fb.array(
        permissionData.SubMenu.map((subPermission: any) => {
          return this.fb.group(
            Object.assign(subPermission, {
              PermissionId: subPermission.PermissionId,
              PermissionType: new FormControl({
                value: subPermission.PermissionType,
                disabled: !subPermission.Checked,
              }),
            })
          );
        })
      ),
    });
    return permission;
  }
  getSubPermission(form: any, index: number): FormArray {
    return form.get('SubPermission') as FormArray;
  }

  editRole() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([ROUTE.EDIT_ROLE]);
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.validateForm();
    if (!this.roleForm.invalid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createRole(payload);
      }
      if (this.formConfig.mode == FORM_MODE.EDIT) {
        this.updateRole(payload);
      }
    }
  }
  createPayload() {
    let selectedPermission: any[] = [];
    let roleData = this.roleForm.value;
    [...roleData.Permission].forEach((permission: any) => {
      [...permission.SubPermission].forEach((subPermission: any) => {
        if (subPermission.Checked) {
              selectedPermission.push(subPermission);
        }
      });
    });
    roleData.Permission = selectedPermission;
    return roleData;
  }
  createRole(payload: any) {
    this.loaderService.show();
    this.rolesService.createRole(payload).subscribe({
      next: (res: any) => {
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
  updateRole(payload: any) {
    this.loaderService.show();
    this.rolesService.editRole(payload, this.formConfig.id).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        // this.toasterService.success(res.message);
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
  validateForm() {
    Object.keys(this.roleForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }

  setControlError(control: string) {
    let formControl = this.getControl(this.roleForm, control);
    if (this.checkError(control, 'required')) {
      this.roleForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (this.checkError(control, 'permissionLength')) {
      this.roleForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(
          control
        )} is required, please select at least 1 permission`,
      });
    } else if (this.checkError(control, 'maxlength')) {
      this.roleForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: INPUT_ERROR.ROLE_NAME_LENGTH,
      });
    } else if (this.checkError(control, 'pattern')) {
      this.roleForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: INPUT_ERROR.ALPHABETS_PATTERN,
      });
    }
  }

  checkError(control: string, error: string) {
    return this.roleForm.get(control)?.hasError(error);
  }

  getControlLabel(control: string) {
    let result: any = Object.values(ROLE_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  onPermissionChange(event: any, type: string, permission: any, index: number) {
    switch (type) {
      case 'MAIN':
        permission
          .get('SubPermission')
          .controls.forEach((control: FormGroup) => {
            this.updatePermission(control, event.target.checked);
            // this.getOneSelectedMainRole(control, event.target.checked)
          });
        break;
      case 'SUB':
        let subPermissions = permission.get('SubPermission') as FormArray;
        permission
          .get('Checked')
          .setValue(
            ![...subPermissions.value].some(
              (permission: any) => !permission.Checked
            )
          );
        this.updatePermission(subPermissions.at(index), event.target.checked);
        // this.getOneSelectedRole(subPermissions, event.target.checked);
        break;
      default:
        break;
    }
  }

  updatePermission(form: any, checked: boolean) {
    form.get('Checked').setValue(checked);
    if (checked) {
      form.get('PermissionType').enable();
      form.get('PermissionType').setValue(1);
    } else {
      form.get('PermissionType').disable();
      form.get('PermissionType').setValue(null);
    }
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }

  goToManage(message?: any) {
    sessionStorage.removeItem(SESSION.USER_ROLES);
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    message != undefined
      ? this.router.navigate([ROUTE.MANAGE_ROLE]).then((m) => {
        this.toasterService.success(message);
      })
      : this.router.navigate([ROUTE.MANAGE_ROLE]);
  }

  onChange(event: any) {
    this.validateFormField(event);
  }
  validateFormField(data: any) {
    let control: FormControl = this.getControl(data.form, data.control);
    if (control.hasError('required')) {
      control?.setErrors({
        ...control.errors,
        invalid: `${this.getControlLabel(data.control)} is required`,
      });
    } else if (control.hasError('minlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Minimum ${control.getError('minlength')?.requiredLength
          } characters are allowed`,
      });
    } else if (control.hasError('maxlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Maximum ${control.getError('maxlength')?.requiredLength
          } characters are allowed`,
      });
    } else if (control.hasError('pattern')) {
      control?.setErrors({
        ...control.errors,
        invalid: this.getControlPatternMessage(data.control),
      });
    }
  }
  getControl(form: any, control: string): FormControl {
    return form.get(control) as FormControl;
  }

  getControlPatternMessage(control: string): any {
    let result: any = Object.values(ROLE_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }
}

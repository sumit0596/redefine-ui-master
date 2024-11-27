import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from 'src/app/admin/services/user.service';
import { SelectModule } from '../../modules/select/select.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-column-group-dialog',
  standalone: true,
  templateUrl: './column-group-dialog.component.html',
  styleUrls: ['./column-group-dialog.component.scss'],
  imports: [CommonModule, SelectModule],
})
export class ColumnGroupDialogComponent {
  dropdownSettings: IDropdownSettings = {};
  roles: any = [];
  sectors: any = [];
  form: any;
  allComplete: boolean = false;
  // propertiesList$: any;
  propertiesSubject = new BehaviorSubject<any[]>([]);
  propertiesList$ = this.propertiesSubject.asObservable();
  properties: any = [];
  status: any = [];
  Debtstatus: any = [];
  Peoplestatus: any = [];
  type: any;
  year: any;

  presentationStatus: any = [];
  category: any;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<ColumnGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    if (
      data.filterColumns != undefined &&
      data.filterColumns.length != 0 &&
      data.selectedColumns.length == 0
    ) {
      this.data.filterColumns.forEach((element: any, index: any) => {
        if (element.field !== 'actions' && element.field !== 'checkbox') {
          element.checked = element.visible ? true : false;
        }

        if (
          element.header === 'Brochures' ||
          element.header === 'Videos' ||
          element.header === 'Units'
        ) {
          element.checked = false;
        }
        if (this.data.tablename === 'All Properties') {
          this.allComplete = false;
        } else {
          this.allComplete = true;
        }
      });
    }
    if (
      data.selectedColumns != undefined &&
      data.selectedColumns.length > 0 &&
      data.selectedColumns.filter((x: any) => x.visible && x.checked).length ===
        data.filterColumns.filter((x: any) => x.visible).length
    ) {
      this.allComplete = true;
    }
  }

  ngOnInit() {
    this.dropdownSettings = {
      idField: 'RoleId',
      textField: 'Name',
      noDataAvailablePlaceholderText: 'There is no item availabale to show',
    };

    if (
      this.sectors.length === 0 &&
      this.data?.selectedSectors &&
      this.data?.selectedSectors.length != 0
    ) {
      this.getProperties(this.data.selectedSectors.map((x: any) => x.Id).toString());
    }

    this.form = new FormGroup({
      roleItems: new FormControl([]),
      sectorItems: new FormControl([]),
      propertyItems: new FormControl([]),
      statusItems: new FormControl([]),
      statusPresentation: new FormControl([]),
      debtStatus: new FormControl([]),
      peopleStatus: new FormControl([]),
      type: new FormControl([]),
      category: new FormControl([]),
      year: new FormControl([]),
    });

    if (this.data.selectedRoles) {
      this.roles = this.data.selectedRoles;
      this.form.controls['roleItems'].setValue(this.data.selectedRoles);
    }
    if (this.data.selectedSectors) {
      this.sectors = this.data.selectedSectors;
      this.form.controls['sectorItems'].setValue(this.data.selectedSectors);
    }
    if (this.data.selectedProperties) {
      this.properties = this.data.selectedProperties;
      this.form.controls['propertyItems'].setValue(
        this.data.selectedProperties
      );
    }
    if (this.data.selectedStatuses) {
      this.status = this.data.selectedStatuses;
      this.form.controls['statusItems'].setValue(this.data.selectedStatuses.Id);
    }
    if (this.data.selectedDebtStatuses) {
      this.Debtstatus = this.data.selectedDebtStatuses;
      this.form.controls['debtStatus'].setValue(
        this.data.selectedDebtStatuses.Id
      );
    }
    if (this.data.selectedPeopleStatuses) {
      this.Peoplestatus = this.data.selectedPeopleStatuses;
      this.form.controls['peopleStatus'].setValue(
        this.data.selectedPeopleStatuses.Id
      );
    }
    if (this.data.selectedCategories) {
      this.category = this.data.selectedCategories;
      this.form.controls['category'].setValue(
        this.data.selectedCategories.DebtCreditCategoryId
      );
    }
    if (this.data.selectedYears) {
      this.year = this.data.selectedYears;
      this.form.controls['year'].setValue(this.data.selectedYears.Id);
    }
    if (this.data.selectedTypes) {
      this.type = this.data.selectedTypes;
      this.form.controls['type'].setValue(this.data.selectedTypes.id);
    }
  }

  setAll(event: any) {
    if (event.target.checked) {
      this.allComplete = true;
      this.data.filterColumns.forEach((element: any) => {
        if (element.field !== 'actions') {
          element.checked = true;
        }
      });
    } else {
      this.allComplete = false;
      let columnHasCheckbox =  this.data.filterColumns.findIndex((column:any) => column.field == "checkbox")
      this.data.filterColumns.forEach((element: any, index: number) => {
        if(columnHasCheckbox>-1){
          element.checked = index == 1 ? true : false;
        }else{
         element.checked = index == 0 ? true : false;
        }
      });
    }
  }

  columnsCheckBox(event: any, column: any) {
    column.checked = event.target.checked;
    if (!event.target.checked) {
      this.allComplete = false;
      if (
        this.data.filterColumns.filter((x: any, index: number) => x.checked)
          .length == 0
      ) {
        if (this.data.tablename=="All South African Properties"|| this.data.tablename=="All Presentations"  || this.data.tablename=="All Webcast"  || this.data.tablename=="Units Created" || this.data.tablename=="All Debt Programme" || this.data.tablename=="All Pricing Supplement" || this.data.tablename=="All Credit Ratings" || this.data.tablename=="All Applicants" || this.data.tablename=="All Leaders" || this.data.tablename=="All Investor Contacts"){
          event.preventDefault();
        }else{
          this.selectAtLeastOne(
            this.data.filterColumns.findIndex(
              (x: any) => x.header === event.target.value
            )
          );
        }
        
      }
    } else {
      if (
        this.data.filterColumns.filter((x: any) => x.visible).length ===
        this.data.filterColumns.filter((x: any) => x.checked).length
      ) {
        this.allComplete = true;
      }
    }
  }

  selectAtLeastOne(index: number) {
    let randomIndex = this.getRandomNumber();
    while (randomIndex == index) {
      randomIndex = this.getRandomNumber();
    }
    this.data.filterColumns[randomIndex].checked = true;
  }

  getRandomNumber() {
    const randomNum =
      Math.floor(
        Math.random() *
          this.data.filterColumns.filter((x: any) => x.visible).length
      ) + 1;
    return randomNum >=
      this.data.filterColumns.filter((x: any) => x.visible).length
      ? randomNum - 2
      : randomNum;
  }

  onRoleSelect(event: any) {
    if (
      this.roles.length === 0 &&
      this.data.selectedRoles &&
      this.data.selectedRoles.length > 0
    ) {
      this.roles = this.data.selectedRoles;
    }
    this.roles.push(event);
  }

  onStatusSelect(event: any) {
    this.status = event;
  }
  onDebtStatusSelect(event: any) {
    this.Debtstatus = event;
  }

  onYearStatusSelect(event: any) {
    this.year = event;
  }

  onPeopleStatusSelect(event: any) {
    this.Peoplestatus = event;
  }
  onCategorySelect(event: any) {
    this.category = event;
  }
  onTypeSelect(event: any) {
    this.type = event;
  }
  closeCategoryDialog(category: any) {
    const data = {
      category: category,
    };
    this.dialogRef.close(data);
  }

  onPresentationStatusSelect(event: any) {
    this.presentationStatus = event;
  }

  onRoleSelectAll(event: any) {
    this.roles = event;
  }

  onRoleDeSelect(event: any) {
    this.removeItem(this.roles, event);
  }

  onStatusDeSelect(event: any) {
    this.removeItem(this.status, event);
  }

  onYearDeSelect(event: any) {
    this.removeItem(this.year, event);
  }

  onPresentationStatusDeSelect(event: any) {
    this.removeItem(this.presentationStatus, event);
  }

  onRoleUnSelectAll() {
    this.roles = [];
  }

  onSectorSelect(event: any) {
    if (
      this.sectors.length === 0 &&
      this.data.selectedSectors &&
      this.data.selectedSectors.length != 0
    ) {
      this.sectors = this.data.selectedSectors;
    }
    this.sectors.push(event);
    if (this.sectors.length > 0) {
      this.getProperties(this.sectors.map((x: any) => x.Id).toString());
    }
  }
  onSectorDeSelect(event: any) {
    this.removeSectorItem(this.sectors, event);
    this.properties.length = 0;
    this.data.selectedProperties.length = 0;
    if (this.sectors.length > 0) {
      this.getProperties(this.sectors.map((x: any) => x.Id).toString());
    }
  }

  onClear(type: string) : any{
    switch(type){
      case 'Sector' :
      return this.sectors  = [];
      case 'Building' :
      return this.properties  = [];
      case 'Role' :
      return this.roles  = [];      
    }
  }

  onPropertySelect(event: any) {
    if (
      this.properties.length === 0 &&
      this.data.selectedProperties &&
      this.data.selectedProperties.length != 0
    ) {
      this.properties = this.data.selectedProperties;
    }
    this.properties.push(event);
  }

  onPropertyDeSelect(event: any) {
    this.removePropertyItem(this.properties, event);
  }

  getProperties(sectors: any) {
    this.userService.getProperties(sectors).subscribe({
      next: (res: any) => {
        this.propertiesSubject.next(res.data);
      },
      error: (error: any) => {},
    });
  }

  removeItem(array: any[], item: any) {
    let index = array.findIndex((role) => role.Id == item.Id);
    array.splice(index, 1);
  }

  removeSectorItem(array: any[], item: any) {
    let index = array.findIndex((sector) => sector.Id == item.Id);
    array.splice(index, 1);
  }

  removePropertyItem(array: any[], item: any) {
    let index = array.findIndex(
      (property) => property.PropertyId == item.PropertyId
    );
    array.splice(index, 1);
  }

  clearColumns() {
    this.data.filterColumns.forEach((element: any) => {
      element.checked = false;
    });
    this.dialogRef.close(this.data.filterColumns);
  }

  clearFilters(): void {
    this.roles = [];
    this.dialogRef.close(this.roles);
  }
  closeDialog(roles: any) {
    const data = {
      roles: roles,
    };
    this.dialogRef.close(data);
  }
  closeColumnGroupDialog(result: any) {
    this.dialogRef.close(result);
  }
  closeSectorPropertyDialog(sector: any, property: any) {
    const data = {
      sector: sector,
      property: property,
    };
    this.dialogRef.close(data);
  }
  closeStatusCategoryDialog(status: any, category: any) {
    if (status instanceof Array && status.length === 0) {
      status = undefined;
    }

    if (category instanceof Array && category.length === 0) {
      category = undefined;
    }
    const data = {
      Debtstatus: status,
      category: category,
    };
    this.dialogRef.close(data);
  }
  close() {
    this.dialogRef.close();
  }

  closeStatusDialog(status: any) {
    const data = {
      status: status,
    };
    this.dialogRef.close(data);
  }

  closeTypeDialog(type: any, year: any) {
    const data = {
      type: type,
      year: year,
    };
    this.dialogRef.close(data);
  }

  closePresentationStatusDialog(status: any) {
    const data = {
      status: status,
    };
    this.dialogRef.close(data);
  }
  closePeopleStatusDialog(status: any) {
    const data = {
      status: status,
    };
    this.dialogRef.close(data);
  }
}

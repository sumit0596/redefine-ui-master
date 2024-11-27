import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { POPUP_TYPE } from '../builder/models/constants';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonPickerComponent } from '../button-picker/button-picker.component';
import { CardPickerComponent } from '../card-picker/card-picker.component';
import { CarouselPickerComponent } from '../carousel-picker/carousel-picker.component';
import { HeadingPickerComponent } from '../heading-picker/heading-picker.component';
import { IconPickerComponent } from '../icon-picker/icon-picker.component';
import { LayoutPickerComponent } from '../layout-picker/layout-picker.component';
import { BannerPickerComponent } from './banner-picker/banner-picker.component';
import { TeamPickerComponent } from './team-picker/team-picker.component';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { PopupPickerComponent } from './popup-picker/popup-picker.component';
import { PagePreviewComponent } from '../page-preview/page-preview.component';
import { environment } from 'src/environments/environment.dev';
import { ContactsPickerComponent } from "./contacts-picker/contacts-picker.component";
@Component({
  selector: 'app-builder-popup',
  standalone: true,
  templateUrl: './builder-popup.component.html',
  styleUrls: ['./builder-popup.component.scss'],
  imports: [
    CommonModule,
    ButtonPickerComponent,
    IconPickerComponent,
    CardPickerComponent,
    LayoutPickerComponent,
    HeadingPickerComponent,
    BannerPickerComponent,
    TeamPickerComponent,
    CarouselPickerComponent,
    InputModule,
    ReactiveFormsModule,
    PopupPickerComponent,
    PagePreviewComponent,
    ContactsPickerComponent
],
})
export class BuilderPopupComponent implements OnInit {
  icons$: Observable<any[]> = of([
    {
      Id: 'arrow-right-circle',
      Name: 'Arrow right circle',
      Svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"/>
        <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 16 4-4-4-4m-4 4h8"/>
      </svg>`,
    },
    {
      Id: 'form',
      Name: 'Form',
      Svg: `<svg width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M20.5 17h-17A2.502 2.502 0 0 1 1 14.5v-4A2.502 2.502 0 0 1 3.5 8h17a2.502 2.502 0 0 1 2.5 2.5v4a2.502 2.502 0 0 1-2.5 2.5zm-17-8A1.502 1.502 0 0 0 2 10.5v4A1.502 1.502 0 0 0 3.5 16h17a1.502 1.502 0 0 0 1.5-1.5v-4A1.502 1.502 0 0 0 20.5 9zM17 12H7v1h10z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>`,
    },
  ]);
  POPUP_TYPE: any = POPUP_TYPE;
  environment : any = environment;
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BuilderPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    switch (this.data.type) {
      case POPUP_TYPE.LINK:
        this.form = this.fb.group({
          Link: [null, Validators.required],
          IsNewTab: [false, Validators.required],
        });
        break;
      case POPUP_TYPE.BUTTON:
        this.form = this.fb.group({
          Label: [null, Validators.required],
          Icon: [null, Validators.required],
          TextFirst: [false, Validators.required],
        });
        break;
      case POPUP_TYPE.IMAGE:
        this.form = this.fb.group({
          Height: [
            null,
            [Validators.required, Validators.min(16), Validators.max(600)],
          ],
          Width: [
            null,
            [Validators.required, Validators.min(16), Validators.max(600)],
          ],
        });
        break;
      case POPUP_TYPE.CAROUSEL:
        this.form = this.fb.group({
          Image: [null, [Validators.required]],
          title: [null, [Validators.required]],
        });
        break;
      default:
        break;
    }
  }
  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
  saveEvent(event: any) {
    this.dialogRef.close(event);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBase } from 'src/app/utilities/form-base';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CAROUSEL_FORM, CONSTANTS } from 'src/app/models/constants';
import { PageBuilderService } from '../../services/page-builder.service';
import { ContextContainer } from 'src/app/core/context/context-container';
import { MatDialogRef } from '@angular/material/dialog';
import { carousel_types } from '../builder/models/carousels';
import { CommonService } from 'src/app/shared/services/common.service';
import { MEDIA_TYPE } from 'src/app/models/enum';
import { CommonModule } from '@angular/common';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { FileModule } from 'src/app/shared/modules/file/file.module';

@Component({
  selector: 'app-carousel-picker',
  standalone: true,
  templateUrl: './carousel-picker.component.html',
  styleUrls: ['./carousel-picker.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, InputModule, FileModule],
})
export class CarouselPickerComponent extends FormBase implements OnInit {
  @Input() carouselData: any;
  @Output() saveEvent: EventEmitter<any> = new EventEmitter<any>();
  fileContainer: any = {};

  carouselList: any[] = carousel_types;
  fileList: any;
  constructor(
    fb: FormBuilder,
    private pageBuilderService: PageBuilderService,
    private context: ContextContainer,
    private commonService: CommonService,
    public sliderModal: MatDialogRef<CarouselPickerComponent>
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      CarouselId: ['', [Validators.required]],
      CustomSlider: this.fb.array([]),
    });
    if (this.carouselData?.id) {
      this.getCarousel(this.carouselData.id);
    } else {
      this.addSlide();
    }
  }
  get carouselId() {
    return this.form?.get('CarouselId') as FormControl;
  }
  get slideForms() {
    return this.form?.get('CustomSlider') as FormArray;
  }

  addSlide(data: any = undefined) {
    const slideForm = this.fb.group({
      CustomSliderId: [null],
      Content: ['', [Validators.required, Validators.maxLength(255)]],
      Description: [null, [Validators.required, Validators.maxLength(255)]],
      ButtonTitle: [null, [Validators.required, Validators.maxLength(255)]],
      ButtonLink: [null, [Validators.required, Validators.maxLength(700)]],
      Image: [null, [Validators.required]],
    });
    if (data) {
      slideForm.patchValue(data);
    }
    this.slideForms.push(slideForm);
  }

  closeDialogue(submit: boolean = false) {
    this.sliderModal.close(submit);
  }

  deleteSlide(index: number, slideData: any) {
    if (slideData.CustomSliderId) {
      this.deleteCarousel(
        this.carouselId.value,
        index,
        slideData.CustomSliderId
      );
    } else {
      this.slideForms.removeAt(index);
    }
  }

  onFileSelect(event: any, index: number = 0) {
    this.uploadMedia(event[0], this.slideForms.at(index), 'Image');
  }

  uploadMedia(file: any, form: any, control: string) {
    this.pageBuilderService.uploadMedia(file, MEDIA_TYPE.CAROUSEL).subscribe({
      next: (res: any) => {
        let file = {
          Url: res.Url,
          Name: res.Name,
          MediaId: res.MediaId,
          CreatedOn: res.CreatedOn,
        };
        form.patchValue({ ...form.value, Image: file });
        // this.addSlide(file)
      },
      error: (error: any) => {
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.context.toasterService.error(errors[err][0]);
    });
  }

  onFileDelete(event: any, type: string, index: number = 0) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.context.loaderService.show();
        this.pageBuilderService.deleteMedia(event.MediaId).subscribe({
          next: (res: any) => {
            this.context.loaderService.hide();
            this.context.toasterService.success(res.message);
            this.updateFormFile('Image', index);
          },
          error: (error: any) => {
            this.context.loaderService.hide();
            error.error.errors
              ? this.displayError(error.error.errors)
              : this.context.toasterService.error(error.error.message);
          },
        });
      }
    });
  }

  updateFormFile(controlName: string, index: number) {
    let slideForm = this.slideForms.controls[index] as FormGroup;
    slideForm.patchValue({ ...slideForm.value, [controlName]: null });
  }
  updateForm(slides: any[]) {
    this.form.patchValue({
      CarouselId: this.carouselData.id
        ? this.carouselData.id
        : this.carouselId.value,
    });
    this.slideForms.clear();
    slides.forEach((slide: any) => {
      slide = {
        ...slide,
        Image:
          slide.MediaUrl && slide.MediaId
            ? {
                Url: slide.MediaUrl,
                Name: slide.MediaName,
                MediaId: slide.MediaId,
                CreatedOn: slide.CreatedOn,
              }
            : null,
      };
      this.addSlide(slide);
    });
  }
  getControlValue(
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

  onChange(event: any) {
    this.validateForm(event);
  }

  submit(event: any) {
    event?.preventDefault();
    if (this.form.valid) {
      let payload = this.createPayload();
      this.createUpdateSlider(payload);
    } else {
      this.validateForm(CAROUSEL_FORM);
    }
  }

  onSelectCarousel() {
    if (this.slideForms?.controls?.length == 0) {
      this.addSlide();
    } else {
      this.getCarousel(this.carouselId.value);
    }
  }
  getCarousel(id: string) {
    this.commonService.getCustomSlider(id).subscribe({
      next: (res: any) => {
        this.updateForm(res);
      },
      error: (error: any) => {
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
  }
  createUpdateSlider(payload: any) {
    this.commonService.addUpdateCustomSlider(payload).subscribe({
      next: (res: any) => {
        this.sliderModal.close(
          this.carouselList.find(
            (value: any) => value.id == this.carouselId.value
          )
        );
        this.context.toasterService.success(res.message);
      },
      error: (error: any) => {
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
  }
  createPayload() {
    let payload = {
      ...this.form.value,
      CustomSlider: [...this.form.value.CustomSlider].map((slider: any) => {
        // if (slider?.Image?.Url) {
        return {
          ...slider,
          Image: slider.Image.Url,
          MediaId: slider.Image.MediaId,
        };
        // } else {
        //   return slider;
        // }
      }),
    };
    return payload;
  }
  deleteCarousel(carouselId: string, index: number, slideId?: number) {
    this.commonService.deleteCustomSlider(carouselId, slideId).subscribe({
      next: (res: any) => {
        this.slideForms.removeAt(index);
        this.context.toasterService.success(res.message);
      },
      error: (error: any) => {
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyRoutingModule } from './property-routing.module';
import { PropertyComponent } from './property.component';
import { PropertyDetailsFormComponent } from '../manage-properties/property-details-form/property-details-form.component';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { PropertyEsgFeaturesComponent } from './components/property-esg-features/property-esg-features.component';
import { PropertyAdvertisingFormComponent } from './components/property-advertising-form/property-advertising-form.component';
import { PropertyConfirmationComponent } from './components/property-confirmation/property-confirmation.component';
import { PropertyContactDetailsFormComponent } from './components/property-contact-details-form/property-contact-details-form.component';
import { PropertyFeaturesFormComponent } from './components/property-features-form/property-features-form.component';
import { PropertyMediaFormComponent } from './components/property-media-form/property-media-form.component';
import { PropertyPreviewComponent } from './components/property-preview/property-preview.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { VacancyScheduleContentComponent } from './components/vacancy-schedule-content/vacancy-schedule-content.component';
import { MatDividerModule } from '@angular/material/divider';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { SwitchModule } from 'src/app/shared/modules/switch/switch.module';
import { DatatableModule } from 'src/app/shared/modules/datatable/datatable.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { EditorComponent } from 'src/app/shared/components/form-elements/editor/editor.component';
import { SliderComponent } from 'src/app/shared/components/form-elements/slider/slider.component';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { CalendarComponent } from 'src/app/shared/components/form-elements/calender/calendar.component';
import { RatingComponent } from 'src/app/shared/components/rating/rating.component';
import { MapModule } from 'src/app/shared/modules/map/map.module';

@NgModule({
  declarations: [
    PropertyComponent,
    PropertyDetailsFormComponent,
    PropertyMediaFormComponent,
    PropertyPreviewComponent,
    PropertyMediaFormComponent,
    PropertyFeaturesFormComponent,
    PropertyContactDetailsFormComponent,
    PropertyAdvertisingFormComponent,
    PropertyConfirmationComponent,
    PropertyEsgFeaturesComponent,
    VacancyScheduleContentComponent,
  ],
  imports: [
    CommonModule,
    PropertyRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
    MatMenuModule,
    MatCardModule,
    MatDividerModule,
    FileModule,
    SelectModule,
    SwitchModule,
    DatatableModule,
    InputModule,
    EditorComponent,
    SliderComponent,
    TextareaComponent,
    CalendarComponent,
    RatingComponent,
    MapModule
  ],

  exports: [PropertyComponent, PropertyPreviewComponent],
})
export class PropertyModule {}

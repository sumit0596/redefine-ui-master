import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitComponent } from './unit.component';
import { UnitDetailsFormComponent } from './components/unit-details-form/unit-details-form.component';
import { UnitMediaFormComponent } from './components/unit-media-form/unit-media-form.component';
import { UnitFeaturesFormComponent } from './components/unit-features-form/unit-features-form.component';
import { UnitRoutingModule } from './unit-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { UnitAvailabilityDialogComponent } from './components/unit-availability-dialog/unit-availability-dialog.component';
import { BrokerCommissionIncentivesFormComponent } from './components/broker-commission-incentives-form/broker-commission-incentives-form.component';
import { TenantIncentivesFormComponent } from './components/tenant-incentives-form/tenant-incentives-form.component';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { SwitchModule } from 'src/app/shared/modules/switch/switch.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { EditorComponent } from 'src/app/shared/components/form-elements/editor/editor.component';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { CalendarComponent } from 'src/app/shared/components/form-elements/calender/calendar.component';

@NgModule({
  declarations: [
    UnitComponent,
    UnitDetailsFormComponent,
    UnitMediaFormComponent,
    UnitFeaturesFormComponent,
    UnitAvailabilityDialogComponent,
    BrokerCommissionIncentivesFormComponent,
    TenantIncentivesFormComponent,
  ],

  imports: [
    CommonModule,
    UnitRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    FileModule,
    SelectModule,
    SwitchModule,
    InputModule,
    EditorComponent,
    TextareaComponent,
    CalendarComponent
  ],
})
export class UnitModule {}

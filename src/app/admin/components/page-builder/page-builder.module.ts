import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageBuilderRoutingModule } from './page-builder-routing.module';
import { PageBuilderComponent } from './page-builder.component';
import { ManagePagesComponent } from './components/manage-pages/manage-pages.component';
import { PageFormComponent } from './components/page-form/page-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { SwitchModule } from 'src/app/shared/modules/switch/switch.module';
import { DatatableModule } from 'src/app/shared/modules/datatable/datatable.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { ContactsPickerComponent } from './components/builder-popup/contacts-picker/contacts-picker.component';

@NgModule({
  declarations: [PageBuilderComponent, ManagePagesComponent, PageFormComponent],
  imports: [
    CommonModule,
    PageBuilderRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FileModule,
    SelectModule,
    SwitchModule,
    DatatableModule,
    InputModule,
    InputModule,
    TextareaComponent,
  ],
})
export class PageBuilderModule {}

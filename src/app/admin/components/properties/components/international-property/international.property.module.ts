import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { InternationalPropertyRoutingModule } from './international-property-routing.module';
import { InternationalPropertyDetailsFormComponent } from './components/international-property-details-form/international-property-details-form.component';
import { InternationalPropertyMediaFormComponent } from './components/international-property-media-form/international-property-media-form.component';
import { InternationalPropertyComponent } from './international-property.component';
import { InternationalPropertyFeaturesFormComponent } from './components/international-property-features-form/international-property-features-form.component';
import { InternationalSeoFormComponent } from './components/international-seo-form/international-seo-form.component';
import { InternationalPropertyConfirmationComponent } from './components/international-property-confirmation/international-property-confirmation.component';
import { InternationalPropertyPreviewComponent } from './components/international-property-preview/international-property-preview.component';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { SwitchModule } from 'src/app/shared/modules/switch/switch.module';
import { DatatableModule } from 'src/app/shared/modules/datatable/datatable.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { EditorComponent } from 'src/app/shared/components/form-elements/editor/editor.component';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { MapModule } from 'src/app/shared/modules/map/map.module';

@NgModule({
  declarations: [
    InternationalPropertyComponent,
    InternationalPropertyDetailsFormComponent,
    InternationalPropertyMediaFormComponent,
    InternationalPropertyFeaturesFormComponent,
    InternationalSeoFormComponent,
    InternationalPropertyConfirmationComponent,
    InternationalPropertyPreviewComponent,
  ],
  imports: [
    CommonModule,
    InternationalPropertyRoutingModule,
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
    FileModule,
    SelectModule,
    SwitchModule,
    DatatableModule,
    InputModule,
    EditorComponent,
    TextareaComponent,
    MapModule
  ],
})
export class InternationalPropertyModule {}

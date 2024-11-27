import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { GridComponent } from './grid.component';
import { AutocompleteModule } from 'src/app/shared/modules/autocomplete/autocomplete.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SelectModule } from '../select/select.module';
import { SwitchModule } from '../switch/switch.module';
import { UnitCardComponent } from '../../components/unit-card/unit-card.component';
import { InputModule } from '../input/input.module';
import { CustomMatPaginatorDirective } from '../../directives/custom-mat-paginator/custom-mat-paginator.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { MapModule } from '../map/map.module';

@NgModule({
  declarations: [GridComponent],
  imports: [
    CommonModule,
    AutocompleteModule,
    ReactiveFormsModule,
    NgxSliderModule,
    MatPaginatorModule,
    SelectModule,
    SwitchModule,
    InputModule,
    NgOptimizedImage,
    UnitCardComponent,
    CustomMatPaginatorDirective,
    NgSelectModule,
    MapModule
  ],
  exports: [GridComponent],
})
export class GridModule {}

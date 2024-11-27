import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SwitchModule } from '../switch/switch.module';
import { SharedModule } from '../../shared.module';
import { DatatableComponent } from './datatable.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [DatatableComponent],
  imports: [
    CommonModule,
    SwitchModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    SharedModule,
    FormsModule,
    MatTableModule,
    NgSelectModule,
    OverlayModule
  ],
  exports: [DatatableComponent],
})
export class DatatableModule {}

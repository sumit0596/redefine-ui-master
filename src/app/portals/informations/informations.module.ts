import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationsRoutingModule } from './informations-routing.module';
import { InformationContainerComponent } from './components/information-container/information-container.component';


@NgModule({
  declarations: [
    InformationContainerComponent
  ],
  imports: [
    CommonModule,
    InformationsRoutingModule
  ]
})
export class InformationsModule { }

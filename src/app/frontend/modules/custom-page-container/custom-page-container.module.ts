import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomPageContainerRoutingModule } from './custom-page-container-routing.module';
import { CustomPageContainerComponent } from './custom-page-container.component';
import { PageContainerComponent } from './components/page-container/page-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileModule } from 'src/app/shared/modules/file/file.module';

@NgModule({
  declarations: [CustomPageContainerComponent, PageContainerComponent],
  imports: [
    CommonModule,
    CustomPageContainerRoutingModule,
    SharedModule,
    FileModule,
  ],
})
export class CustomPageContainerModule {}

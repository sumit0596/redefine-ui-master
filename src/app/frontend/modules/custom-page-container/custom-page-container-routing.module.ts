import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPageContainerComponent } from './custom-page-container.component';

const routes: Routes = [
  {
    path: '',
    component: CustomPageContainerComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomPageContainerRoutingModule {}
